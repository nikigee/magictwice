<template>
    <NavBar />
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="d-flex align-items-center justify-content-end">
                    <!-- <h1>Features and Notes</h1> -->
                    <div class="">
                        <button class="btn btn-outline-primary py-1 px-2" v-on:click="toggleEdit">Edit</button>
                    </div>
                </div>

                <VMarkdownEditor v-if="edit" v-model="$md.ply.stats.misc_notes" locale="en"
                    :upload-action="handleUpload"></VMarkdownEditor>
                <VMarkdownView class="mb-5" v-if="!edit" mode="dark" :content="$md.ply.stats.misc_notes">
                </VMarkdownView>
            </div>
            <div class="col-md-3 mb-3">
                <div class="text-center">
                    <img :src="$md.ply.render.avatar" class="img-fluid shadow rounded d-none d-md-block mx-auto"
                        style="max-height: 500px;" />
                </div>
                <PlayerBio />
                <DiceRoller class="border-top mt-3 pt-2" />
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import PlayerBio from '@/components/PlayerBio.vue'
import DiceRoller from '../components/DiceRoller.vue'
import { VMarkdownEditor, VMarkdownView } from 'vue3-markdown'
import 'vue3-markdown/dist/style.css'

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
        VMarkdownEditor,
        VMarkdownView
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        this.ply = player;
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

<style lang="scss" scoped></style>