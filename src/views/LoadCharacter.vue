<template>
    <div class="container text-center">
        <div class="text-start mt-5">
            <router-link to="/" class="text-decoration-none">
                <i class="bi bi-arrow-left"></i> Back
            </router-link>
        </div>
        <div class="row mt-3 mb-5">
            <div class="col-xl-5 text-start">
                <h1 class="mb-2 py-2 display-4 text-uppercase fst-italic">Load your Character</h1>
                <p class="lead col-lg-10 mb-5">All stories begin, only some end. But tonight — one continues.</p>
            </div>
            <div class="col text-start">
                <h2 class="mb-3 py-2">Upload Character</h2>
                <div style="" class="mx-auto text-start">
                    <label for="formFileLg" class="form-label">Upload a character file (.json format)</label>
                    <input class="form-control form-control-lg" id="formFileLg" type="file" @change="handleFileUpload">
                </div>
                <hr class="mb-4" />
                <h2 class="mb-2 mt-0">List of Characters</h2>
                <div class="row justify-content-start">
                    <div class="col-6 col-sm-4 g-2" v-for="(character, key) in characters">
                        <CharacterCard class="" :char="character" :link="key" />
                    </div>
                    <div v-if="Object.keys(characters).length === 0">
                        <p class="lead mt-2">no characters... yet.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footerr />
</template>

<script>
import CharacterCard from "@/components/CharacterCard.vue";
import Footerr from "@/components/Footerr.vue";

function getCharacters() {
    if (localStorage.getItem('charList')) {
        return JSON.parse(localStorage.getItem('charList'));
    } else {
        return {};
    }
}
export default {
    components: {
        CharacterCard: CharacterCard,
        Footerr
    },
    data() {
        return {
            characters: getCharacters()
        }
    },
    mounted() {
        document.title = "Load Character - Magic Dice";
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0]; // Get the uploaded file
            if (file && file.name.endsWith('.json')) {
                file.text().then((result) => {
                    this.$md.magicHandler.managed_players = [];
                    this.$md.Load.restoreFromObj(JSON.parse(result), false);
                    this.$md.magicHandler.last.self;
                    this.$md.savePlayer();

                    this.characters = getCharacters();
                }).catch((err) => {
                    console.error(err);
                });
            } else {
                // File is either not selected or not in JSON format
                console.error('Please select a JSON file.');
                // You can also display an error message to the user
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>