<template>
    <div class="container text-center">
        <div class="text-start mt-5">
            <router-link to="/" class="text-decoration-none">
                <i class="bi bi-arrow-left"></i> Back
            </router-link>
        </div>
        <div class="row mt-3 mb-5">
            <div class="col-xl-5 text-start mb-2">
                <h1 class="mb-2 py-2 display-4 text-uppercase fst-italic">Load your Character</h1>
                <p class="lead col-lg-10">All stories begin, only some end. But tonight — one continues.</p>
            </div>
            <div class="col text-start">
                <hr class="mb-4" />
                <div class="row justify-content-start mx-0 align-items-center">
                    <div class="col-6 col-sm-4 g-2" v-for="(character, key) in characters">
                        <CharacterCard class="" :char="character" :link="key" />
                    </div>
                    <div class="col-6 col-sm-4 g-2 text-center rounded upload-card">
                        <div class="card upload rounded">
                            <div class="h1"><i class="bi bi-file-earmark-arrow-up"></i></div>
                            <label for="formFileLg" class="form-label">Upload a character file (.json format)</label>
                            <input class="form-control" id="formFileLg" type="file" accept=".json"
                                @change="handleFileUpload">
                        </div>
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

<style lang="css" scoped>
.upload {
    padding: 30px;
    border: none;
}

.form-label{
    font-size: 0.8rem;
}
</style>

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
        document.documentElement.removeAttribute("data-theme");

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