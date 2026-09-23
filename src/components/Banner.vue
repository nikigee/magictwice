<template>
    <div class="p-0 position-relative banner d-print-none">
        <div :style="bannerStyle" class="banner-glow"></div>
        <div 
            class="rounded" 
            v-if="!$md.ply.render.banner.url" 
            id="banner-default"
            :style="{ backgroundImage: 'var(--default-banner)', maxWidth: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>
        <div 
            class="rounded" 
            v-if="$md.ply.render.banner.url" 
            id="banner-custom"
            :style="{ backgroundImage: 'url(' + $md.ply.render.banner.url + ')', maxWidth: '100\%', height: '10rem', backgroundSize: 'cover', backgroundPosition:$md.ply.render.banner.pos }">
        </div>

        <div class="position-absolute top-0 end-0">
            <div class="dropdown">
                <button @click="saveTemp()" class="btn" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                    <form class="px-3 py-2" @submit.prevent>
                        <div class="mb-2">
                            <label for="bannerBase64" class="form-label">Upload Banner</label>
                            <input 
                                @change="onFileChange" 
                                class="form-control form-control-sm" 
                                type="file" 
                                accept="image/*"
                                id="bannerBase64" 
                                :disabled="isUploading"
                            />

                            <!-- Upload Progress & Error Feedback -->
                            <div v-if="isUploading" class="small text-primary mt-1">
                                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                Uploading banner...
                            </div>
                            <div v-if="uploadError" class="small text-danger mt-1">
                                {{ uploadError }}
                            </div>
                        </div>

                        <!-- <div class="mb-2">
                            <input 
                                v-model="bannerUrlInput" 
                                type="text" 
                                class="form-control" 
                                id="bannerURL"
                                placeholder="url" 
                                :disabled="isUploading" 
                            />
                        </div> -->

                        <div class="mb-3">
                            <label for="bannerPOS" class="form-label">Banner Position</label>
                            <select id="bannerPOS" v-model="$md.ply.render.banner.pos" class="form-control" :disabled="isUploading">
                                <option value="top">Top</option>
                                <option value="center">Center</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>

                        <div class="d-flex">
                            <mdButton @click="changeBanner" :disabled="isUploading">
                                {{ isUploading ? 'Uploading...' : 'Save' }}
                            </mdButton>
                            <mdButton @click="clearBanner" :disabled="isUploading">Clear</mdButton>
                            <mdButton @click="revertBanner" :disabled="isUploading">Undo</mdButton>
                        </div>
                    </form>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import mdButton from "@/components/ui/mdButton.vue";
import ColorThief from "colorthief";
import { useAPIStore } from "@/stores/apiStore"; // Adjust the path if your store directory differs
import { useAlertStore } from "@/stores/alertStore";

export default {
    name: "Banner",
    components: {
        mdButton
    },
    data() {
        return {
            banner: {
                url: '',
                pos: 'center'
            },
            dominantColor: null,
            isUploading: false,
            uploadError: ""
        };
    },
    methods: {
        changeBanner() {
            if (this.isUploading) return;
            this.setGlow();
            this.$md.savePlayer();
        },
        saveTemp() {
            this.banner.url = this.$md.ply.render.banner.url;
            this.banner.pos = this.$md.ply.render.banner.pos;
            this.uploadError = "";
        },
        revertBanner() {
            if (this.isUploading) return;
            this.$md.ply.render.banner.url = this.banner.url;
            this.$md.ply.render.banner.pos = this.banner.pos;
            this.uploadError = "";
            this.setGlow();
        },
        clearBanner() {
            if (this.isUploading) return;
            this.$md.ply.render.banner.url = '';
            this.$md.ply.render.banner.pos = 'center';
            this.uploadError = "";

            this.setGlow();
            this.$md.savePlayer();
        },
        async onFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Optional client-side size check (e.g. 10MB max for high-res banners)
            const MAX_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                this.uploadError = "Banner file size exceeds 10MB limit.";
                e.target.value = "";
                return;
            }

            this.isUploading = true;
            this.uploadError = "";

            try {
                const apiStore = useAPIStore();
                const { imageUrl } = await apiStore.uploadImage(file);

                // Set banner URL to CDN proxy route
                this.$md.ply.render.banner.url = imageUrl;

                // Recompute the dynamic glow box-shadow with the new image
                this.setGlow();

                useAlertStore().create("Banner uploaded successfully!", "success");
            } catch (err) {
                console.error("Banner upload failed:", err);
                this.uploadError = err.message || "Failed to upload banner. Please try again.";
            } finally {
                this.isUploading = false;
                e.target.value = "";
            }
        },
        lightenRGB([r, g, b], factor = 0.15) {
            const rgb = [r, g, b];
            const fraction = 255 * factor;

            const idx = [0, 1, 2].sort((a, b) => rgb[a] - rgb[b]);

            const lowest = idx[0];
            const middle = idx[1];
            const highest = idx[2];

            if (rgb[lowest] === 255) return rgb;

            const out = [...rgb];
            out[lowest] = Math.min(255, Math.round(rgb[lowest] + fraction));

            const incFrac = (out[lowest] - rgb[lowest]) / (255 - rgb[lowest]);
            out[middle] = Math.round(rgb[middle] + (255 - rgb[middle]) * incFrac);
            out[highest] = Math.round(rgb[highest] + (255 - rgb[highest]) * incFrac);

            return out;
        },
        saturateRGB([r, g, b], factor = 1.0) {
            let rn = r / 255,
                gn = g / 255,
                bn = b / 255;

            const max = Math.max(rn, gn, bn);
            const min = Math.min(rn, gn, bn);
            const delta = max - min;

            let h;
            if (delta === 0) {
                h = 0;
            } else if (max === rn) {
                h = ((gn - bn) / delta) % 6;
            } else if (max === gn) {
                h = (bn - rn) / delta + 2;
            } else {
                h = (rn - gn) / delta + 4;
            }
            h = (h * 60 + 360) % 360;

            const l = (max + min) / 2;
            const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

            let s2 = s * (1 + factor);
            s2 = Math.min(Math.max(s2, 0), 1);

            const c = (1 - Math.abs(2 * l - 1)) * s2;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;

            let [rp, gp, bp] = [0, 0, 0];
            if (h < 60) [rp, gp, bp] = [c, x, 0];
            else if (h < 120) [rp, gp, bp] = [x, c, 0];
            else if (h < 180) [rp, gp, bp] = [0, c, x];
            else if (h < 240) [rp, gp, bp] = [0, x, c];
            else if (h < 300) [rp, gp, bp] = [x, 0, c];
            else [rp, gp, bp] = [c, 0, x];

            return [
                Math.round((rp + m) * 255),
                Math.round((gp + m) * 255),
                Math.round((bp + m) * 255),
            ];
        },
        setGlow() {
            let default_banner = window.getComputedStyle(document.documentElement).getPropertyValue("--default-banner");
            default_banner = default_banner.replace("url(", "").replace(")", "").replace(/['"]/g, "").trim();
            const banner_src = this.$md.ply.render.banner.url || default_banner;

            if (!banner_src) return;

            if (!this.$md.ply.render.banner.url && (document.documentElement.getAttribute("data-theme") === "cyberpunk")) {
                this.dominantColor = "rgb(54 0 107)";
            } else {
                const img = document.createElement("img");
                img.crossOrigin = "Anonymous"; // Allows ColorThief to read pixel data from your CDN proxy
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
        }
    },
    computed: {
        bannerUrlInput: {
            get() {
                const url = this.$md.ply.render.banner.url || '';
                if (url.startsWith('data:')) {
                    return '';
                }
                return url;
            },
            set(newUrl) {
                this.$md.ply.render.banner.url = newUrl;
                this.setGlow();
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

        const defaultBanner = document.querySelector("#banner-default");
        if (defaultBanner) {
            defaultBanner.addEventListener("glow", () => {
                if (!this.banner.url) {
                    this.setGlow();
                }
            });
        }
    }
};
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