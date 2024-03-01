<template>
    <div>
        <div class="mb-3">
            <h4 class="">Saving Throws</h4>
            <ul class="list-group list-group-flush">
                <li class="list-group-item list-group-item-action d-flex justify-content-between"
                    :class="$md.ply.stats.save_throws.find((v) => v == x[0]) ? 'list-group-item-primary' : ''"
                    v-for="x in $md.ply.stats.sthrows">
                    <div>{{ getName(x[0]) }}</div>
                    <div>{{ x[1] }}</div>
                </li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="">Skills</h4>
            <ul class="list-group list-group-flush">
                <li class="list-group-item list-group-item-action d-flex justify-content-between" :class="getColor(skill)"
                    v-for="(skill, key) in $md.ply.stats.skill_modifiers">
                    <div>{{ skill.name }}</div>
                    <div>{{ calcSkill(skill, $md.ply.stats) }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

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
        }
    }
}
</script>

<style lang="scss" scoped></style>