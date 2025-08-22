<template>
    <NavBar />
    <div class="container" v-if="$md.ply">
        <div class="row">
            <div class="col-lg-9 col">
                <!-- <h1>Features and Notes</h1> -->
                <div class="d-grid gap-2 mb-3 d-lg-none">
                    <button type="button" class="btn btn-outline-primary btn-block mobile-edit"
                        @click="toggleEdit()">Edit
                        Notes</button>
                </div>

                <VMarkdownEditor class="editor" v-if="edit" v-model="$md.ply.stats.misc_notes" locale="en"
                    :upload-action="handleUpload"></VMarkdownEditor>
                <VMarkdownView class="mb-5 markdown" v-if="!edit" mode="dark" :content="$md.ply.stats.misc_notes">
                </VMarkdownView>
            </div>
            <div class="col-md-3 mb-3 d-none d-lg-block">
                <div class="d-grid gap-2">
                    <button type="button" class="btn btn-outline-primary btn-block" @click="toggleEdit()">Edit
                        Notes</button>
                </div>
                <DiceRoller class="mt-3" />
            </div>
        </div>
    </div>
    <div class="container" v-else>
        <h1>Sorry, this character doesn't exist :C</h1>
    </div>
    <Footerr />
    <MobileNavBar />
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import PlayerBio from '@/components/PlayerBio.vue'
import DiceRoller from '../components/DiceRoller.vue'
import { VMarkdownEditor, VMarkdownView } from 'vue3-markdown'
import 'vue3-markdown/dist/style.css'
import MdButtonLarge from '../components/ui/mdButtonLarge.vue'
import MobileNavBar from '../components/MobileNavBar.vue'
import Footerr from '@/components/Footerr.vue'

export default {
    data() {
        return {
            ply: null,
            edit: false
        }
    },
    components: {
        NavBar: NavBar,
        PlayerBio: PlayerBio,
        DiceRoller: DiceRoller,
        MdButtonLarge,
        VMarkdownEditor,
        VMarkdownView,
        MobileNavBar,
        Footerr
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        this.ply = player;
    },
    mounted() {
        document.title = `Notes - ${this.$md.ply.name}`;
    },
    methods: {
        handleUpload() {
            console.log("meme");
        },
        toggleEdit() {
            this.$md.savePlayer(); // save changes
            return this.edit ? this.edit = false : this.edit = true;
        }
    }
}
</script>

<style lang="scss" scoped>
.editor {
    min-height: 90vh;
}
.markdown {
    background: var(--bs-body-bg);
}
</style>