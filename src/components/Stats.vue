<template>
    <div>
        <div class="mb-3">
            <h4 class="">Saving Throws</h4>
            <hr class="mt-2 mb-0" />
            <ul class="list-group list-group-flush">
                <li class="list-group-item list-group-item-action d-flex justify-content-between"
                    :class="$md.ply.stats.save_throws.find((v) => v == x[0]) ? 'list-group-item-primary' : ''"
                    v-for="x in $md.ply.stats.sthrows">
                    <div>{{ getName(x[0]) }}</div>
                    <div>
                        <span>{{ x[1] }}</span>
                        <span class="dropdown">
                            <i class="bi bi-three-dots ms-2" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" @click="roll(x[1])">Roll</a>
                                </li>
                                <li><a class="dropdown-item" @click="toggleSThrow(x[0]); $md.savePlayer()">{{
                        $md.ply.stats.save_throws.find((v) => v == x[0]) ? "Remove" : "Add" }}
                                        Proficiency</a></li>
                            </ul>
                        </span>

                    </div>
                </li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="">Skills</h4>
            <hr class="mt-2 mb-0" />
            <ul class="list-group list-group-flush">
                <li class="list-group-item list-group-item-action d-flex justify-content-between"
                    :class="getColor(skill)" v-for="(skill, key) in $md.ply.stats.skill_modifiers">
                    <div>{{ skill.name }}</div>
                    <div>
                        <span>
                            {{ calcSkill(skill, $md.ply.stats) }}
                        </span>
                        <span class="dropdown">
                            <i class="bi bi-three-dots ms-2" data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" @click="roll(calcSkill(skill, $md.ply.stats))">Roll</a>
                                </li>
                                <li><a class="dropdown-item"
                                        @click="$md.ply.stats.makeProficent(key); $md.savePlayer();">{{
                        skill.proficent ? "Remove" : "Add" }} Proficiency</a></li>
                                <li><a class="dropdown-item"
                                        @click="$md.ply.stats.expertCheck(key); $md.savePlayer();">{{ skill.expert ?
                                        "Remove" : "Add" }} Expertise</a></li>
                            </ul>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<!-- @click="roll(calcSkill(skill, $md.ply.stats))" -->

<script>
export default {
    name: "Stats",
    methods: {
        getColor: (skl) => {
            if (skl.expert)
                return 'list-group-item-success';
            else if (skl.proficent)
                return 'list-group-item-primary';
            else
                return '';
        },
        calcSkill: (skl, ply) => {
            let val = ply.ability_mod[skl.raw];
            if (skl.proficent) {
                val += ply.prof;
                if (skl.expert) {
                    val += ply.prof;
                }
            }
            return val;
        },
        toggleSThrow(v) {
            if (this.$md.ply.stats.save_throws.includes(v)) {
                const index = this.$md.ply.stats.save_throws.indexOf(v);
                if (index > -1) {
                    this.$md.ply.stats.save_throws.splice(index, 1); // remove proficiency
                }
            } else if (this.$md.ply.stats.sthrows.get(v) !== undefined) {
                this.$md.ply.stats.save_throws.push(v); // add proficiency
            }
        },
        getName: (key) => {
            switch (key) {
                case "str":
                    return "Strength";
                case "dex":
                    return "Dexterity";
                case "cnst":
                    return "Constitution";
                case "int":
                    return "Intelligence";
                case "wis":
                    return "Wisdom";
                case "chr":
                    return "Charisma";
                default:
                    return "Attribute";
            }
        },
        roll(v) {
            this.$md.diceHistory.push(this.$md.Dice.x("d20+" + v)); // roll and save
        }
    }
}
</script>

<style lang="scss" scoped>
.bi-three-dots {
    display: none;
}

.list-group-item-action:hover .bi-three-dots {
    display: inline;
    cursor: pointer;
}

.bi-three-dots::bs-toggle .bi-three-dots {
    display: inline;
    cursor: pointer;
}

.dropdown{
    vertical-align: middle;
}

.dropdown-item {
    cursor: pointer;
}

/* Style for mobile devices (less than 768px width) */
@media (max-width: 767px) {
    .bi-three-dots {
        display: inline;
    }
}
</style>