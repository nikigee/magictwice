<template>
    <NavBar class="shadow" />
    <div class="banner-img" id="spellbanner">
        <div class="banner"></div>
    </div>
    <div class="container pt-3">
        <h1 class="display-4 spell-heading">Spells</h1>
        <div class="d-flex spell-buttons align-items-center fs-3">
            <button type="button" class="btn btn-link text-muted me-3 spell-button p-0" data-bs-toggle="modal"
                data-bs-target="#createSpellModal">
                <i class="bi bi-plus-circle fs-3"></i>
            </button>
            <div class="text-muted me-3" title="Prepared Spells" v-if="$md.ply.magic.getPreparedSpells().length">
                P: {{ $md.ply.magic.getPreparedSpells().length }}
            </div>
            <div class="text-muted spell-button me-3">
                <i class="bi bi-three-dots"></i>
            </div>
        </div>
        <!-- no spells? -->
        <div class="mt-2" v-if="$md.ply.magic.spells.size == 0">
            <hr class="hr" />
            <p class="lead">Your character doesn't have any spells.</p>
        </div>
        <div class="spell-table mb-5 mt-4">
            <div v-for="group in getSpellsByLevel($md.ply.magic.spells)" :key="group[0]">
                <h3 class="text-capitalize h5">{{ group[0] }} Level</h3>
                <hr class="m-0 mb-2" />
                <ul class="list-group list-group-flush mb-3">
                    <!-- Table Header -->
                    <div class="px-3">
                        <div class="row lato-bold text-uppercase" style="font-size: 13px;">
                            <div class="col">Name</div>
                            <div class="col">Casting Time</div>
                            <div class="col d-none d-sm-block">Duration</div>
                            <div class="col d-none d-sm-block">Range / Area</div>
                            <div class="col-4 d-none d-md-block">Description</div>
                            <div class="col-1"></div>
                        </div>
                    </div>
                    <!-- Spell details -->
                    <div class="my-1 py-2 spell-item" v-for="spell in group[1]" :key="spell.id">
                        <router-link class="text-decoration-none d-block p-3 py-0 spell-link"
                            :to="`/player/${$md.ply.id}/spell/${spell.id}`">
                            <div class="row align-items-center">
                                <div class="col text-primary">{{ spell.name }} <span class="text-secondary ps-1"
                                        title="This spell is prepared" v-if="spell.prepared">P</span> <span
                                        class="text-secondary ps-1" title="Can be ritual casted"
                                        v-if="spell.ritual == 'yes'">R</span></div>
                                <div class="col">{{ spell.ctime.length >= 27 ? spell.ctime.slice(0, 26) + "..." :
                                    spell.ctime }}</div>
                                <div class="col d-none d-sm-block">{{ spell.duration }}</div>
                                <div class="col d-none d-sm-block">{{ spell.range }}</div>
                                <div class="col-4 text-muted d-none d-md-block" style="font-size: 15px;">
                                    {{ spell.description.slice(0, 65) }}...
                                </div>
                                <div class="col-1">
                                    <div class="dropdown text-end">
                                        <button class="btn text-muted py-0 px-3" type="button"
                                            :id="`dropdownMenuButton-${spell.id}`" data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu" :aria-labelledby="`dropdownMenuButton-${spell.id}`">
                                            <li>
                                                <div class="dropdown-item"
                                                    v-if="spell.level.toLowerCase() !== 'cantrip'"
                                                    @click="prepareSpell(spell, $event)"><i
                                                        :class="spell.prepared ? 'bi bi-dash' : 'bi bi-plus'"></i> {{
                                                    spell.prepared ? "Unprepare" : "Prepare" }}</div>
                                                <div class="dropdown-item" @click="deleteSpell(spell, $event)"><i
                                                        class="bi bi-x text-danger"></i> Remove</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </ul>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createSpellModal" tabindex="-1" aria-labelledby="createSpellModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="submitSpell">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createSpellModalLabel">Add a new spell</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label mb-1 text-body-secondary">Name</label>
                            <input type="text" class="form-control" v-model="newSpell.name" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label mb-1 text-body-secondary">Ritual</label>
                            <select class="form-select form-select-sm" v-model="newSpell.ritual" required>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        <div class="row mb-3">
                            <div class="col">
                                <label class="form-label mb-1 text-body-secondary">Level</label>
                                <input type="text" class="form-control form-control-sm" list="levels"
                                    v-model="newSpell.level" required />
                                <datalist id="levels">
                                    <option value="Cantrip" />
                                    <option value="1st" />
                                    <option value="2nd" />
                                    <option value="3rd" />
                                    <option value="4th" />
                                    <option value="5th" />
                                    <option value="6th" />
                                    <option value="7th" />
                                    <option value="8th" />
                                    <option value="9th" />
                                </datalist>
                            </div>
                            <div class="col">
                                <label class="form-label mb-1 text-body-secondary">School</label>
                                <input type="text" class="form-control form-control-sm" list="schools"
                                    v-model="newSpell.school" required />
                                <datalist id="schools">
                                    <option value="Evocation" />
                                    <option value="Abjuration" />
                                    <option value="Conjuration" />
                                    <option value="Divination" />
                                    <option value="Enchantment" />
                                    <option value="Illusion" />
                                    <option value="Necromancy" />
                                    <option value="Transmuation" />
                                </datalist>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label mb-1 text-body-secondary">Components</label>
                            <input type="text" class="form-control form-control-sm" v-model="newSpell.components"
                                placeholder="V, S, M" required />
                        </div>

                        <div class="row mb-3">
                            <div class="col">
                                <label class="form-label mb-1 text-body-secondary">Casting Time</label>
                                <input type="text" class="form-control form-control-sm" v-model="newSpell.ctime"
                                    placeholder="1 Action" required />
                            </div>
                            <div class="col">
                                <label class="form-label mb-1 text-body-secondary">Duration</label>
                                <input type="text" class="form-control form-control-sm" v-model="newSpell.duration"
                                    placeholder="Instantaneous" required />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label mb-1 text-body-secondary">Range / Area</label>
                            <input type="text" class="form-control form-control-sm" v-model="newSpell.range"
                                placeholder="Self" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label mb-1 text-body-secondary">Description</label>
                            <textarea class="form-control" v-model="newSpell.description" rows="6" required></textarea>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0">
                        <MdButton type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Cancel
                        </MdButton>
                        <MdButton type="submit" class="btn btn-outline-primary" data-bs-dismiss="modal">
                            Submit
                        </MdButton>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <Footerr />
    <MobileNavBar />
</template>

<script setup>
import MobileNavBar from '../components/MobileNavBar.vue';
import NavBar from '../components/NavBar.vue';
import Footerr from '@/components/Footerr.vue';
import MdButton from '../components/ui/mdButton.vue';

function getSpellsByLevel(spells) {
    // arr = Map with keys as level and values as an array of spells
    let arr = new Map();
    spells.forEach(element => {
        // if that level exists in the map, add it to that levels list of spells
        const lvl = element.level.toLowerCase();
        if (arr.has(lvl)) {
            arr.get(lvl).push(element);
        } else {
            arr.set(lvl, [element]);
        }
    });
    return arr;
}
</script>

<script>
export default {
    data() {
        return {
            newSpell: {
                name: '',
                level: '',
                school: '',
                components: '',
                ctime: '',
                ritual: 'no',
                concentration: 'no',
                description: '',
                duration: '',
                range: '',
                roll: '',
                url: ''
            }
        }
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player) {
            this.$md.Load.restoreFromObj(player);
        }
    },
    mounted() {
        document.title = `Spells - ${this.$md.ply.name}`;
    },
    methods: {
        deleteSpell(spell, event) {
            event.preventDefault();
            this.$md.ply.magic.spells.delete(spell.name);
            this.$md.savePlayer();
        },
        prepareSpell(spell, event) {
            event.preventDefault();
            spell.prepared = spell.prepared ? false : true;
            this.$md.savePlayer();
        },
        submitSpell() {
            // Trim values to avoid whitespace-only input.
            const { name, level, school, description } = this.newSpell;
            if (!name.trim()) {
                alert("Spell name is required.");
                return;
            }
            if (!level.trim()) {
                alert("Spell level is required.");
                return;
            }
            if (!school.trim()) {
                alert("Spell school is required.");
                return;
            }
            if (!description.trim()) {
                alert("Spell description is required.");
                return;
            }

            // Attempt to add the spell.
            try {
                this.$md.ply.magic.addJSON(this.newSpell);

                const new_spell = this.$md.ply.magic.spells.get(this.newSpell.name);

                this.$md.savePlayer(); // save changes

                // Navigate to the new spell's detail page.
                this.$router.push({ path: `/player/${this.$md.ply.id}/spell/${new_spell.id}` });
            } catch (err) {
                console.error("Error adding spell:", err);
                alert("There was an error adding the spell. Please check the input and try again.");
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.banner {
    background: linear-gradient(to bottom, #00000000, var(--bs-body-bg));
    height: 19vh;
}

.dropdown-menu {
    z-index: 999999;
}

.banner-img {
    background: url("../assets/img/bg/1.jpg") top center;
    background-size: cover;
}

.spell-heading {
    letter-spacing: 0.5rem;
    text-transform: uppercase;
}

.spell-button {
    cursor: pointer;
    text-align: center;
}

.spell-button:hover {
    color: var(--bs-white) !important;
}

.modal-footer button {
    font-size: 12px !important;
}

.spell-item:hover {
    box-shadow: 0px 0px 5px var(--bs-primary) !important;
    transition: 0.5s;
}

.spell-link {
    color: var(--bs-white);
}
</style>
