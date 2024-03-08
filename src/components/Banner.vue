<template>
    <div class="p-0 position-relative">
        <div class="rounded" v-if="!$md.ply.render.banner.url"
            :style="{ backgroundImage: 'url(' + require('@/assets/img/bg/3.jpg') + ')', maxWidth: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>
        <div class="rounded" v-if="$md.ply.render.banner.url"
            :style="{ backgroundImage: 'url(' + $md.ply.render.banner.url + ')', maxWidth: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: $md.ply.render.banner.pos }">
        </div>
        <div class="position-absolute top-0 end-0">
            <div class="dropdown">
                <button @click="saveTemp()" class="btn" data-bs-toggle="dropdown" aria-expanded="false"><i
                        class="bi bi-three-dots"></i></button>
                <ul class="dropdown-menu">
                    <form class="px-3 py-2" @submit="(e) => { e.preventDefault(); return false; }">
                        <div class="mb-2">
                            <label for="bannerURL" class="form-label">Banner URL</label>
                            <input v-model="$md.ply.render.banner.url" type="text" class="form-control" id="bannerURL"
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
            }
        };
    },
    methods: {
        changeBanner() {
            // if (!this.banner.url) {
            //     return false;
            // }

            //this.$md.ply.render.banner.url = this.banner.url;
            //this.$md.ply.render.banner.pos = this.banner.pos;

            //this.banner.url = ""; // clear

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

            this.$md.savePlayer(); // save player
        }
    }
}
</script>

<style lang="scss" scoped></style>