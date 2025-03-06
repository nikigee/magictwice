<template>
    <NavBar />
    <div class="container">
        <div class="bg-body-secondary p-3 rounded shadow my-3">
            {
                name = "Unkown Spell",
                level = "1st",
                school = "Spell",
                components = "V S",
                ctime = "1 Action",
                ritual = "no",
                concentration = "no",
                description = "No description exists for this spell.",
                duration = "Instantaneous",
                range = "10 feet",
                roll = "0d4",
                url = "https://dnd5e.fandom.com/wiki/" + name.replace(/ /g, "_"),
            }
        </div>
        <p class="lead">Spells: {{ $md.ply.magic.spells.size }}</p>
        <div v-if="spellMessage" class="alert alert-success">
            <p class="m-0">{{ spellMessage }}</p>
        </div>
        <div>
            <label class="form-label">Add Spell (json)</label>
            <textarea class="form-control" rows="5" v-model="spellJson"></textarea>
            <button type="button" class="btn btn-outline-primary btn-sm mt-2 px-3" @click="addspell">Add</button>
        </div>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

<script>
export default {
    data() {
        return {
            spellJson: "",
            spellMessage: ""
        }
    },
    created() {
        // load character
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player) {
            this.$md.Load.restoreFromObj(player);
        }
    },
    methods: {
        addspell() {
            let obj;
            if (!this.spellJson) {
                return false;
            }
            try {
                obj = JSON.parse(this.spellJson.trim());
            } catch (e) {
                return false;
            }
            const spell = this.$md.ply.magic.addJSON(obj);
            this.$md.savePlayer();

            this.spellJson = "";
            this.spellMessage = `Spell '${spell.name}' added!`;1
        }
    }
}
</script>