<template>
    <div class="p-0 position-relative banner">
        <div :style="bannerStyle" class="banner-glow">
        </div>
        <div class="rounded" v-if="!$md.ply.render.banner.url" id="banner-default"
            :style="{ backgroundImage: 'url(' + require('@/assets/img/bg/3.jpg') + ')', maxWidth: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>
        <div class="rounded" v-if="$md.ply.render.banner.url" id="banner-custom"
            :style="{ backgroundImage: 'url(' + $md.ply.render.banner.url + ')', maxWidth: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: $md.ply.render.banner.pos }">
        </div>

        <div class="position-absolute top-0 end-0">
            <div class="dropdown">
                <button @click="saveTemp()" class="btn" data-bs-toggle="dropdown" aria-expanded="false"><i
                        class="bi bi-three-dots"></i></button>
                <ul class="dropdown-menu">
                    <form class="px-3 py-2" @submit="(e) => { e.preventDefault(); return false; }">
                        <div class="mb-2">
                            <label for="bannerBase64" class="form-label">Banner Source</label>
                            <input @change="onFileChange" class="form-control form-control-sm" type="file"
                                id="bannerBase64" />
                        </div>
                        <div class="mb-2">
                            <input v-model="bannerUrlInput" type="text" class="form-control" id="bannerURL"
                                placeholder="url" />
                        </div>
                        <div class="mb-3">
                            <label for="bannerPOS" class="form-label">Banner Position</label>
                            <select id="bannerPOS" v-model="$md.ply.render.banner.pos" class="form-control">
                                <option value="top">Top</option>
                                <option value="center">Center</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>
                        <div class="d-flex">
                            <mdButton @click="changeBanner">Save</mdButton>
                            <mdButton @click="clearBanner">Clear</mdButton>
                            <mdButton @click="revertBanner">Undo</mdButton>
                        </div>
                    </form>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import mdButton from "@/components/ui/mdButton.vue"
import ColorThief from "colorthief";


export default {
    name: "Banner",
    components: {
        mdButton: mdButton
    },
    data() {
        return {
            banner: {
                url: '',
                pos: 'center'
            },
            dominantColor: null
        };
    },
    methods: {
        changeBanner() {
            this.setGlow();

            this.$md.savePlayer(); // save player
        },
        saveTemp() {
            this.banner.url = this.$md.ply.render.banner.url;
            this.banner.pos = this.$md.ply.render.banner.pos;
            
        },
        revertBanner() {
            this.$md.ply.render.banner.url = this.banner.url;
            this.$md.ply.render.banner.pos = this.banner.pos;
            
        },
        clearBanner() {
            this.$md.ply.render.banner.url = '';
            this.$md.ply.render.banner.pos = 'center';

            this.setGlow();

            this.$md.savePlayer(); // save player
        },
        onFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.$md.ply.render.banner.url = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        lightenRGB([r, g, b], factor = 0.15) {
            const rgb = [r, g, b];
            const fraction = 255 * factor;

            // build an array of channel indexes 0,1,2 and sort **those**
            const idx = [0, 1, 2].sort((a, b) => rgb[a] - rgb[b]); // ascending

            const lowest = idx[0];
            const middle = idx[1];
            const highest = idx[2];

            if (rgb[lowest] === 255) return rgb; // already max brightness

            const out = [...rgb]; // clone

            // push the darkest channel upward
            out[lowest] = Math.min(255, Math.round(rgb[lowest] + fraction));

            // same proportion for the other two
            const incFrac = (out[lowest] - rgb[lowest]) / (255 - rgb[lowest]);
            out[middle] = Math.round(rgb[middle] + (255 - rgb[middle]) * incFrac);
            out[highest] = Math.round(rgb[highest] + (255 - rgb[highest]) * incFrac);

            return out;
        },
        saturateRGB([r, g, b], factor = 1.0) {
            // 1. normalise channel values to 0-1
            let rn = r / 255,
                gn = g / 255,
                bn = b / 255;

            // 2. RGB → HSL  (lightness-preserving hue model)
            const max = Math.max(rn, gn, bn);
            const min = Math.min(rn, gn, bn);
            const delta = max - min;

            // Hue
            let h;
            if (delta === 0) {
                h = 0;                               // achromatic
            } else if (max === rn) {
                h = ((gn - bn) / delta) % 6;
            } else if (max === gn) {
                h = (bn - rn) / delta + 2;
            } else {
                h = (rn - gn) / delta + 4;
            }
            h = (h * 60 + 360) % 360;              // 0-360°

            // Lightness & Saturation
            const l = (max + min) / 2;             // 0-1
            const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

            // 3. Boost / reduce saturation
            let s2 = s * (1 + factor);             // e.g. +30 %
            s2 = Math.min(Math.max(s2, 0), 1);     // clamp 0-1

            // 4. HSL → RGB
            const c = (1 - Math.abs(2 * l - 1)) * s2;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;

            let [rp, gp, bp] = [0, 0, 0];
            if (h < 60) [rp, gp, bp] = [c, x, 0];
            else if (h < 120) [rp, gp, bp] = [x, c, 0];
            else if (h < 180) [rp, gp, bp] = [0, c, x];
            else if (h < 240) [rp, gp, bp] = [0, x, c];
            else if (h < 300) [rp, gp, bp] = [x, 0, c];
            else[rp, gp, bp] = [c, 0, x];

            // 5. denormalise and return
            return [
                Math.round((rp + m) * 255),
                Math.round((gp + m) * 255),
                Math.round((bp + m) * 255),
            ];
        },
        setGlow() {
            const banner_src = this.$md.ply.render.banner.url || require('@/assets/img/bg/3.jpg');

            const img = document.createElement("img");
            img.crossOrigin = "Anonymous"; // required for CORS-safe images
            img.src = banner_src;
            img.onload = () => {
                const colorThief = new ColorThief();
                try {
                    let color = colorThief.getColor(img);
                    color = this.saturateRGB(color);

                    this.dominantColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                } catch (e) {
                    console.warn("ColorThief error:", e.message);
                }
            };
        }
    },
    computed: {
        bannerUrlInput: {
            get() {
                const url = this.$md.ply.render.banner.url || '';
                // If the URL is a data URL, return an empty string.
                if (url.startsWith('data:')) {
                    return '';
                }
                return url;
            },
            set(newUrl) {
                this.$md.ply.render.banner.url = newUrl;
            }
        },
        bannerStyle() {
            return {
                boxShadow: `
                0px 5px 40px 0px rgba(0, 0, 0, 0.4),
                0px 0px 200px 5px ${this.dominantColor || 'none'}
            `
            };
        }
    },
    mounted() {
        this.setGlow();
    }
}
</script>

<style lang="scss" scoped>
.banner-glow {
    z-index: -900;
    position: absolute;
    width: 100%;
    height: 100%;
    transition: 3s ease-out;

}
</style>