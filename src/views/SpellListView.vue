<template>
    <NavBar class="shadow" />
    <div class="banner-img d-print-none" id="spellbanner">
        <div class="banner"></div>
    </div>
    <div class="container spell-view pt-3">
        <h1 class="display-4 spell-heading mb-2">Spells</h1>

        <!-- Neat Toolbar Under Spells -->
        <div class="spell-toolbar d-flex flex-wrap align-items-center gap-2 mb-3 d-print-none">
            <button type="button"
                class="btn spell-toolbar-btn spell-toolbar-btn-primary d-inline-flex align-items-center gap-2 rounded-1"
                data-bs-toggle="modal" data-bs-target="#createSpellModal" @click="openCreateModal">
                <i class="bi bi-plus-lg"></i>
                <span>Add Spell</span>
            </button>

            <div class="dropdown">
                <button type="button" class="btn spell-toolbar-btn d-inline-flex align-items-center gap-2 rounded-1"
                    :class="{ 'active-filter': filterPrepared || filterRitual }" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" id="spellSettings" aria-expanded="false">
                    <i class="bi bi-sliders"></i>
                    <span>Filter</span>
                    <span v-if="(filterPrepared ? 1 : 0) + (filterRitual ? 1 : 0) > 0"
                        class="badge rounded-1 bg-primary text-dark fw-bold ms-1">
                        {{ (filterPrepared ? 1 : 0) + (filterRitual ? 1 : 0) }}
                    </span>
                </button>
                <ul class="dropdown-menu spell-dropdown-menu shadow rounded-1 py-1" aria-labelledby="spellSettings">
                    <li class="dropdown-header text-uppercase small fw-bold text-body-secondary px-3 py-1">
                        Filter Spells
                    </li>
                    <li>
                        <button type="button"
                            class="dropdown-item d-flex align-items-center justify-content-between gap-3 py-2 px-3"
                            @click="toggleFilter('prepared', $event)">
                            <span class="d-flex align-items-center gap-2">
                                <i class="bi"
                                    :class="filterPrepared ? 'bi-check-square-fill text-primary' : 'bi-square text-secondary'"></i>
                                <span>Prepared spells</span>
                            </span>
                            <span class="badge rounded-1 bg-secondary bg-opacity-25 text-body-secondary">
                                {{ $md.ply.magic.getPreparedSpells().length }}
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button"
                            class="dropdown-item d-flex align-items-center justify-content-between gap-3 py-2 px-3"
                            @click="toggleFilter('ritual', $event)">
                            <span class="d-flex align-items-center gap-2">
                                <i class="bi"
                                    :class="filterRitual ? 'bi-check-square-fill text-primary' : 'bi-square text-secondary'"></i>
                                <span>Ritual spells</span>
                            </span>
                        </button>
                    </li>
                    <template v-if="filterPrepared || filterRitual">
                        <li>
                            <hr class="dropdown-divider my-1" />
                        </li>
                        <li>
                            <button type="button"
                                class="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-body-secondary small"
                                @click="clearFilters($event)">
                                <i class="bi bi-arrow-counterclockwise"></i>
                                <span>Reset filters</span>
                            </button>
                        </li>
                    </template>
                </ul>
            </div>

            <!-- Active Filter Indicators -->
            <div v-if="filterPrepared || filterRitual" class="d-flex flex-wrap align-items-center gap-2 ms-sm-2">
                <span v-if="filterPrepared" class="filter-chip rounded-1 d-inline-flex align-items-center gap-1"
                    @click="toggleFilter('prepared', $event)">
                    Prepared ({{ $md.ply.magic.getPreparedSpells().length }})
                    <i class="bi bi-x"></i>
                </span>
                <span v-if="filterRitual" class="filter-chip rounded-1 d-inline-flex align-items-center gap-1"
                    @click="toggleFilter('ritual', $event)">
                    Ritual
                    <i class="bi bi-x"></i>
                </span>
            </div>
        </div>
        <!-- no spells? -->
        <div class="mt-2" v-if="$md.ply.magic.spells.size == 0">
            <p class="lead text-body-secondary">Your character doesn't have any spells.</p>
        </div>
        <div class="spell-table mb-5 mt-4">
            <div v-for="group in getSpellsByLevel($md.ply.magic.spells)" :key="group[0]">
                <h3 class="text-capitalize h5">{{ group[0] }} Level</h3>
                <hr class="m-0 mb-2" />
                <ul class="list-group list-group-flush mb-3">
                    <!-- Table Header -->
                    <div class="px-3">
                        <div class="row lato-bold text-uppercase" style="font-size: 13px">
                            <div class="col">Name</div>
                            <div class="col">Casting Time</div>
                            <div class="col d-none d-sm-block">Duration</div>
                            <div class="col d-none d-sm-block">Range / Area</div>
                            <div class="col-4 d-none d-md-block">Description</div>
                            <div class="col-1 d-print-none"></div>
                        </div>
                    </div>
                    <!-- Spell details -->
                    <div class="my-1 py-2 spell-item" v-for="spell in group[1]" :key="spell.id">
                        <router-link class="text-decoration-none d-block p-3 py-0 spell-link"
                            :to="`/player/${$md.ply.id}/spell/${spell.id}`">
                            <div class="row align-items-center">
                                <div class="col text-primary">
                                    {{ spell.name }}
                                    <span class="text-secondary ps-1" title="This spell is prepared"
                                        v-if="spell.prepared">P</span>
                                    <span class="text-secondary ps-1" title="Can be ritual casted"
                                        v-if="spell.ritual == 'yes'">R</span>
                                </div>
                                <div class="col text-truncate">
                                    {{ spell.ctime }}
                                </div>
                                <div class="col d-none d-sm-block">{{ spell.duration }}</div>
                                <div class="col d-none d-sm-block">{{ spell.range }}</div>
                                <div class="col-4 text-muted d-none d-md-block text-truncate" style="font-size: 15px">
                                    {{ spell.description }}
                                </div>
                                <div class="col-1 d-print-none" @click.stop.prevent>
                                    <div class="dropdown text-end">
                                        <button class="btn spell-row-action-btn text-muted px-2 py-1 rounded-1"
                                            type="button" :id="`dropdownMenuButton-${spell.id}`"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end spell-dropdown-menu shadow rounded-1 py-1"
                                            :aria-labelledby="`dropdownMenuButton-${spell.id}`">
                                            <li>
                                                <button type="button"
                                                    class="dropdown-item d-flex align-items-center gap-2 py-2 px-3"
                                                    data-bs-toggle="modal" data-bs-target="#createSpellModal"
                                                    @click="openEditModal(spell, $event)">
                                                    <i class="bi bi-pencil-square text-body-secondary"></i>
                                                    <span>Edit Spell</span>
                                                </button>
                                            </li>
                                            <li v-if="spell.level.toLowerCase() !== 'cantrip'">
                                                <button type="button"
                                                    class="dropdown-item d-flex align-items-center gap-2 py-2 px-3"
                                                    @click="prepareSpell(spell, $event)">
                                                    <i class="bi"
                                                        :class="spell.prepared ? 'bi-bookmark-dash text-warning' : 'bi-bookmark-check text-primary'"></i>
                                                    <span>{{ spell.prepared ? "Unprepare" : "Prepare" }}</span>
                                                </button>
                                            </li>
                                            <li>
                                                <hr class="dropdown-divider my-1" />
                                            </li>
                                            <li>
                                                <button type="button"
                                                    class="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger"
                                                    @click="deleteSpell(spell, $event)">
                                                    <i class="bi bi-trash3"></i>
                                                    <span>Remove</span>
                                                </button>
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

    <!-- CREATE SPELL MODAL -->
    <div class="modal fade" id="createSpellModal" tabindex="-1" aria-labelledby="createSpellModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="submitSpell">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createSpellModalLabel">
                            {{ isEditing ? "Edit Spell" : "Add a new spell" }}
                        </h5>
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
    <Footerr class="spell-view" />
    <MobileNavBar />
</template>

<script setup>
import { ref } from "vue";
import MobileNavBar from "../components/MobileNavBar.vue";
import NavBar from "../components/NavBar.vue";
import Footerr from "@/components/Footerr.vue";
import MdButton from "../components/ui/mdButton.vue";

let filterPrepared = ref(false);
let filterRitual = ref(false);

let savedFilters = sessionStorage.getItem("spellFilters");
if (savedFilters) {
    savedFilters = JSON.parse(savedFilters);
    filterPrepared.value = savedFilters.prepared;
    filterRitual.value = savedFilters.ritual;
}

function toggleFilter(filter, event) {
    if (event) event.preventDefault();
    switch (filter) {
        case "prepared":
            filterPrepared.value = filterPrepared.value ? false : true;
            break;
        case "ritual":
            filterRitual.value = filterRitual.value ? false : true;
            break;
        default:
            break;
    }

    const filters = {
        prepared: filterPrepared.value,
        ritual: filterRitual.value,
    };

    sessionStorage.setItem("spellFilters", JSON.stringify(filters));
}

function clearFilters(event) {
    if (event) event.preventDefault();
    filterPrepared.value = false;
    filterRitual.value = false;
    sessionStorage.setItem(
        "spellFilters",
        JSON.stringify({ prepared: false, ritual: false })
    );
}

function getSpellsByLevel(spells) {
    let arr = new Map();

    spells.forEach((element) => {
        const lvl = element.level.toLowerCase();

        let include = true;

        // Ritual and Prepared Filters
        if (filterPrepared.value && filterRitual.value) {
            // OR logic
            include = element.prepared === true || element.ritual === "yes";

            if (element.level.toLowerCase() == "cantrip") {
                include = true;
            }
        } else if (filterPrepared.value) {
            include = element.prepared === true;

            if (element.level.toLowerCase() == "cantrip") {
                include = true;
            }
        } else if (filterRitual.value) {
            include = element.ritual === "yes";
        }

        if (include) {
            if (arr.has(lvl)) {
                arr.get(lvl).push(element);
            } else {
                arr.set(lvl, [element]);
            }
        }
    });

    return arr;
}
</script>

<script>
export default {
    data() {
        return {
            isEditing: false,
            oldSpellName: null,
            newSpell: {
                name: "",
                level: "",
                school: "",
                components: "",
                ctime: "",
                ritual: "no",
                concentration: "no",
                description: "",
                duration: "",
                range: "",
                roll: "",
                url: "",
            },
        };
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
        openCreateModal() {
            this.isEditing = false;
            this.oldSpellName = null;
            this.newSpell = {
                name: "",
                level: "",
                school: "",
                components: "",
                ctime: "",
                ritual: "no",
                concentration: "no",
                description: "",
                duration: "",
                range: "",
                roll: "",
                url: "",
            };
        },
        openEditModal(spell, event) {
            if (event) event.preventDefault();
            this.isEditing = true;
            this.oldSpellName = spell.name;
            // Clone the spell data so we don't mutate state directly before submitting
            this.newSpell = { ...spell };
        },
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

            // Attempt to add or edit the spell.
            try {
                // If editing, remove the old version of the spell first
                // (This is necessary because the spell map is keyed by spell.name)
                if (this.isEditing && this.oldSpellName) {
                    this.$md.ply.magic.spells.delete(this.oldSpellName);
                }

                this.$md.ply.magic.addJSON(this.newSpell);

                const new_spell = this.$md.ply.magic.spells.get(this.newSpell.name);

                this.$md.savePlayer(); // save changes

                // Optionally navigate to the spell's detail page, or stay on the list if editing
                if (!this.isEditing) {
                    this.$router.push({ path: `/player/${this.$md.ply.id}/spell/${new_spell.id}` });
                }

                // Clean up modal state
                this.openCreateModal();
            } catch (err) {
                console.error("Error saving spell:", err);
                alert(
                    "There was an error saving the spell. Please check the input and try again."
                );
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.banner {
    background: linear-gradient(to bottom, #00000000, var(--bs-body-bg));
    height: 19vh;
}

.banner-img {
    background: url("../assets/img/bg/1.jpg") top center;
    background-size: cover;
}

.spell-heading {
    letter-spacing: 0.5rem;
    text-transform: uppercase;
}

.capitalise {
    text-transform: capitalize;
}

/* Toolbar Under Spells */
.spell-toolbar-btn {
    background: var(--bs-secondary-bg);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: var(--bs-body-color);
    font-size: 0.9rem;
    padding: 0.4rem 0.9rem;
    transition: all 0.15s ease;

    &:hover {
        border-color: rgba(255, 255, 255, 0.28);
        background: rgba(255, 255, 255, 0.06);
        color: var(--bs-white);
    }

    &.active-filter {
        border-color: var(--bs-primary);
    }
}

.spell-toolbar-btn-primary {
    border-color: var(--bs-primary);
    color: var(--bs-primary);

    &:hover {
        background: var(--bs-primary);
        color: #090c11;
    }
}

.filter-chip {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: var(--bs-body-secondary);
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
    user-select: none;
    transition: all 0.15s ease;

    &:hover {
        border-color: var(--bs-primary);
        color: var(--bs-white);
    }
}

/* Neat Dropdown Menus */
.spell-dropdown-menu {
    z-index: 1050;
    min-width: 210px;
    background: var(--bs-body-bg);
    border: 1px solid rgba(255, 255, 255, 0.14);

    .dropdown-item {
        font-size: 0.92rem;
        cursor: pointer;
        transition: background-color 0.12s ease;

        &:hover,
        &:focus {
            background: rgba(255, 255, 255, 0.06);
        }

        &:active {
            background: rgba(255, 255, 255, 0.1);
            color: inherit;
        }
    }
}

.spell-row-action-btn {
    border: 1px solid transparent;
    transition: all 0.15s ease;

    &:hover,
    &[aria-expanded="true"] {
        color: var(--bs-white) !important;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.12);
    }
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
