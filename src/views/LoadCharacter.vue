<template>
    <div class="container text-center">
        <h1 class="mb-4 mt-5 py-2 display-4">Load Character</h1>
        <div class="row justify-content-center">
            <template v-for="(character, key) in characters">
                <CharacterCard :char="character" :link="key" />
            </template>
        </div>
    </div>
</template>

<script>
import CharacterCard from "@/components/CharacterCard.vue";

function getCharacters() {
    return JSON.parse(localStorage.getItem('charList'));
}
export default {
    components: {
        CharacterCard: CharacterCard
    },
    data() {
        return {
            characters: getCharacters()
        }
    }
}
</script>

<style lang="scss" scoped></style>