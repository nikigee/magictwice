<template>
    <div class="banner-img">
        <div class="banner"></div>
    </div>
    <div class="container py-3 pb-5">
        <div class="text-start my-3">
            <router-link to="/" class="text-decoration-none">
                <i class="bi bi-arrow-left"></i> Back
            </router-link>
        </div>

        <div class="text-center pt-1">
            <h1 class="mb-2 py-2 display-4 create-title">Create Your Character</h1>
            <p class="lead">
                Is it time to begin another adventure? If so, some basic details are needed
                to create your <i>level one character</i>.
            </p>
            <p class="text-muted">(Don't worry, you can adjust the level within the app.)</p>
        </div>
        <hr />
        <div class="form pb-5">
            <!-- Display errors if any -->
            <div v-if="errors.length" class="alert alert-danger">
                <ul class="mb-0">
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </div>
            <h2 class="text-start my-4">Step 1. Choose a Name, Race</h2>
            <div class="mb-3 row align-items-center">
                <label for="characterName" class="col-sm-3 col-form-label">Character Name</label>
                <div class="col-sm-9">
                    <input type="text" id="characterName" class="form-control" v-model="character.name" />
                </div>
            </div>
            <div class="mb-3 row align-items-center">
                <label for="race" class="col-sm-3 col-form-label">Race</label>
                <div class="col-sm-9">
                    <input type="text" id="race" class="form-control" v-model="character.race" />
                </div>
            </div>
            <h2 class="text-start my-4">Step 2. Choose a Class</h2>
            <div class="mb-3 row align-items-center">
                <label for="characterClass" class="col-sm-3 col-form-label">Class</label>
                <div class="col-sm-9">
                    <input type="text" id="characterClass" class="form-control" v-model="character.characterClass" />
                </div>
            </div>
            <div class="mb-3 row align-items-center">
                <label for="ac" class="col-sm-3 col-form-label">AC</label>
                <div class="col-sm-9">
                    <input type="text" id="ac" class="form-control" v-model="character.ac" placeholder="10 + dex" />
                </div>
            </div>
            <div class="mb-3 row align-items-center">
                <label for="hitDie" class="col-sm-3 col-form-label">Hit Die</label>
                <div class="col-sm-9">
                    <select id="hitDie" class="form-control" v-model="character.hitDie" required>
                        <option value="">Select a hit die...</option>
                        <option value="d6">d6</option>
                        <option value="d8">d8</option>
                        <option value="d10">d10</option>
                        <option value="d12">d12</option>
                    </select>
                </div>
            </div>
            <div class="mb-3 row align-items-center">
                <label for="proficiencyBonus" class="col-sm-3 col-form-label">Proficiency Bonus</label>
                <div class="col-sm-9">
                    <input type="text" id="proficiencyBonus" class="form-control" disabled readonly
                        v-model="character.proficiencyBonus" />
                </div>
            </div>
            <h2 class="text-start mt-4">Step 3. Determine Ability Scores</h2>
            <p class="mb-3 text-muted">
                Tip: Don't forget to add any racial bonuses!
            </p>
            <div class="mb-3 row ab-scores">
                <div class="text-center col-4 col-lg">
                    <div class="text-muted">Strength</div>
                    <input type="number" id="strength" class="form-control form-control-lg"
                        v-model.number="character.abilities.strength" value="10" max="30" min="1" />
                    <div class="text-muted">({{ serAbility(character.abilities.strength) }})</div>
                </div>
                <div class="text-center col-4 col-lg">
                    <div class="text-muted">Dexterity</div>
                    <input type="number" id="dexterity" class="form-control form-control-lg"
                        v-model.number="character.abilities.dexterity" value="10" max="30" min="1" />
                    <div class="text-muted">({{ serAbility(character.abilities.dexterity) }})</div>
                </div>
                <div class="text-center col-4 col-lg">
                    <div class="text-muted">Constitution</div>
                    <input type="number" id="constitution" class="form-control form-control-lg"
                        v-model.number="character.abilities.constitution" value="10" max="30" min="1" />
                    <div class="text-muted">({{ serAbility(character.abilities.constitution) }})</div>
                </div>
                <div class="text-center col-4 col-lg">
                    <div class="text-muted">Intelligence</div>
                    <input type="number" id="intelligence" class="form-control form-control-lg"
                        v-model.number="character.abilities.intelligence" value="10" max="30" min="1" />
                    <div class="text-muted">({{ serAbility(character.abilities.intelligence) }})</div>
                </div>
                <div class="text-center col-4 col-lg">
                    <div class="text-muted">Wisdom</div>
                    <input type="number" id="wisdom" class="form-control form-control-lg"
                        v-model.number="character.abilities.wisdom" value="10" max="30" min="1" />
                    <div class="text-muted">({{ serAbility(character.abilities.wisdom) }})</div>
                </div>
                <div class="text-center col-4 col-lg">
                    <div class="text-muted">Charisma</div>
                    <input type="number" id="charisma" class="form-control form-control-lg"
                        v-model.number="character.abilities.charisma" value="10" max="30" min="1" />
                    <div class="text-muted">({{ serAbility(character.abilities.charisma) }})</div>
                </div>
            </div>
            <h2 class="text-start mt-4">Step 4. Describe Your Character</h2>
            <p class="mb-4 text-muted">
                Tip: Be sure to note what proficiencies your background gives you for later.
            </p>
            <div class="mb-3 row align-items-center">
                <label for="background" class="col-sm-3 col-form-label">Background</label>
                <div class="col-sm-9">
                    <input type="text" id="background" class="form-control" v-model="character.background" />
                </div>
            </div>
            <div class="mb-3 row align-items-center">
                <label for="languages" class="col-sm-3 col-form-label">Languages</label>
                <div class="col-sm-9">
                    <input type="text" id="languages" class="form-control" aria-describedby="languageHelp"
                        v-model="character.languages" />
                </div>
            </div>
            <div class="mb-3 row">
                <label for="equipment" class="col-sm-3 col-form-label">Equipment</label>
                <div class="col-sm-9">
                    <textarea id="equipment" class="form-control" aria-describedby="languageHelp" rows="4"
                        v-model="character.equipment"></textarea>
                </div>
            </div>
            <h2 class="text-start mt-4">Step 5. Generate Character</h2>
            <p class="mb-4">
                Have a look over everything you've done and make sure there isn't anything
                missing. Once you're ready you can proceed.
            </p>

            <p>
                Just note however, you're not done yet. Once the character has been generated
                you'll want to then make sure to select your saving throw and skill
                proficiencies, write up your notes (features, tool / equipment proficiencies,
                etc.) and select any spells.
            </p>
            <hr />
            <div class="text-center">
                <button type="button" class="btn btn-outline-primary px-5 py-3" @click="createCharacter">
                    Create Character
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(()=>{
    document.title = "Create Character - Magic Dice";
})
</script>

<script>
export default {
    name: "CharacterForm",
    data() {
        return {
            character: {
                name: "",
                race: "",
                characterClass: "",
                hitDie: "",
                proficiencyBonus: "+2",
                ac: "",
                abilities: {
                    strength: 10,
                    dexterity: 10,
                    constitution: 10,
                    intelligence: 10,
                    wisdom: 10,
                    charisma: 10,
                },
                background: "",
                languages: "",
                equipment: "",
            },
            errors: []
        };
    },
    methods: {
        // Returns the ability modifier for a given ability score
        serAbility(value) {
            let modifier = -5;
            for (let i = 1; i <= 31; i += 2) {
                if (i >= value) {
                    return modifier;
                } else {
                    modifier++;
                }
            }
        },
        // Validate required fields before character creation
        validateForm() {
            this.errors = [];
            if (!this.character.name.trim()) {
                this.errors.push("Character Name is required.");
            }
            if (!this.character.race.trim()) {
                this.errors.push("Race is required.");
            }
            if (!this.character.characterClass.trim()) {
                this.errors.push("Class is required.");
            }
            if (!this.character.hitDie) {
                this.errors.push("Hit Die selection is required.");
            }
            // Make sure AC is there
            if (!this.character.ac) {
                this.errors.push("AC is required.");
            }
            return this.errors.length === 0;
        },
        createCharacter() {
            // Run form validation first
            if (!this.validateForm()) {
                return;
            }
            // Calculate dexterity modifier first so that AC calculation works properly.
            const dexMod = this.serAbility(this.character.abilities.dexterity);
            // If AC hasn't been manually set, default to 10 + dexterity modifier
            if (!this.character.ac) {
                this.character.ac = "10 + dex";
            }

            // Calculate hit points from the hit die using the $md global helper
            const hp = this.$md.Dice.x(this.character.hitDie).max;
            const conMod = this.serAbility(this.character.abilities.constitution);

            const characterJSON = {
                name: this.character.name,
                classData: {
                    name: this.character.characterClass,
                    hitdie: this.character.hitDie,
                },
                lvl: 1,
                statsData: {
                    ability: {
                        str: this.character.abilities.strength,
                        dex: this.character.abilities.dexterity,
                        cnst: this.character.abilities.constitution,
                        int: this.character.abilities.intelligence,
                        wis: this.character.abilities.wisdom,
                        chr: this.character.abilities.charisma,
                    },
                },
                healthData: {
                    maxHP: hp + conMod,
                    currentHP: hp + conMod,
                    hitdie: this.character.hitDie,
                    defaultAC: this.character.ac,
                    currentAC: this.character.ac,
                },
            };

            // generate some basic notes for the player
            characterJSON.statsData.misc_notes = `
# ${characterJSON.name}
**Race:** ${this.character.race}

**Background:** ${this.character.background}

## Attacks
| Name | Hit | Damage | Properties |
|------|-----|--------|------------|
| Dagger | +5 | 1d4 + dex | Finesse, Light, Thrown (range 20/60) |

## Proficiencies
**Languages:** ${this.character.languages}

**Tools:** 

**Armor:**

**Weapons:**

## Equipment
${this.character.equipment}

# Features
Class features go here ฅ^•ﻌ•^ฅ

..

These notes use Markdown - a simple and easy way to format your text. 

If you need help with syntax, use this: [Basic Syntax | Markdown Guide](https://www.markdownguide.org/basic-syntax/)

Happy note taking : )
            `.trim();

            // Reset or initialize properties on the $md global object as needed
            this.$md.magicHandler.managed_players = [];
            this.$md.Load.restoreFromObj(characterJSON);
            this.$md.magicHandler.last.self;
            this.$md.savePlayer();

            this.$router.push({ path: `/player/${this.$md.magicHandler.last.id}` });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/magicdice.scss";

.create-title {
    font-variant: small-caps;
}

.banner {
    background: linear-gradient(to bottom, #00000000, $body-bg-dark);
    height: 20vh;
}

.form {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}

.banner-img {
    background: url("../assets/img/bg/2.jpg") center center;
    background-size: cover;
}

.col-form-label,
.form-label {
    font-family: "Lato", sans-serif;
    font-weight: bold;
}

.ab-scores .form-control {
    text-align: center;
}

.btn {
    font-size: 18px;
}
</style>
