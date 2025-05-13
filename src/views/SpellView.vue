<template>
    <NavBar />
    <div class="container text-center">
        <div class="row">
            <div class="col-xl-8 m-auto mb-4">
                <div class="text-start">
                    <router-link :to="`/player/${$md.ply.id}/spells/`" class="text-decoration-none"><i
                            class="bi bi-arrow-left"></i> Back</router-link>
                </div>
                <h1 class="display-3 text-uppercase mt-4">{{ spell.name }}</h1>
                <p class="lead text-body-secondary">{{ spell.level }}-level {{ spell.school }}</p>
                <hr />
                <div class="d-flex flex-wrap justify-content-around">
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Casting Time</div>
                        <div>{{ spell.ctime }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Range / Area</div>
                        <div>{{ spell.range }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Components</div>
                        <div>{{ spell.components }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Duration</div>
                        <div>{{ spell.duration }}</div>
                    </div>
                    <div class="p-2">
                        <div class="text-uppercase text-body-secondary">Ritual</div>
                        <div>{{ spell.ritual }}</div>
                    </div>
                </div>
                <div v-html="prettyDescription(spell.description)" class="spell-description mt-4 text-start">
                </div>
            </div>
        </div>
    </div>
    <MobileNavBar />
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import DOMPurify from 'dompurify';
import MobileNavBar from '../components/MobileNavBar.vue';

import { ref } from 'vue';

let hasDiceRoll = ref(false);

function prettyDescription(description) {
    if (!description) return '';

    const paragraphs = description.split(/\n\s*\n/); // Split into paragraphs

    const html = paragraphs
        .map(paragraph => {
            // Detect and format unordered lists
            if (paragraph.trim().startsWith('-')) {
                const listItems = paragraph
                    .split('\n')
                    .map(line => line.trim().replace(/^-/, '').trim()) // Remove leading `-`
                    .map(item => `<li>${item}</li>`) // Wrap each line in <li>
                    .join('');
                return `<ul>${listItems}</ul>`; // Wrap all items in <ul>
            }

            // Bold "At higher levels."
            paragraph = paragraph.replace(/(At higher levels\.)/gi, '<strong>$1</strong>');

            // Wrap dice rolls like "2d8", "1d12", etc., in <a> tags
            paragraph = paragraph.replace(/(\b\d+d\d+\b)/g, '<a href="#">$1</a>');

            if (paragraph.includes("</a>")) {
                hasDiceRoll.value = true;
            }

            return `<p>${paragraph.trim()}</p>`; // Wrap in <p> if not a list
        })
        .join('');

    return DOMPurify.sanitize(html); // Sanitize the final HTML
}



</script>

<script>
export default {
    data() {
        return {
            spell: {}
        }
    },
    mounted() {
        document.title = `${this.spell.name} - ${this.$md.ply.name}`;
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player) {
            this.$md.Load.restoreFromObj(player);

            const spell = this.$route.params.spell;
            this.$md.ply.magic.spells.forEach(value => {
                if (value.id == spell) {
                    this.spell = value;
                }
            });
        }
    }
}
</script>

<style lang="scss">
.spell-description p {
    font-size: 1.1em;
}

.spell-description a {
    text-decoration: none;
}
</style>