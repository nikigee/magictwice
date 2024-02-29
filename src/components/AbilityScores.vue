<template>
    <div>
        <div class="mb-2">
            <label for="md-abscores" class="text-body-secondary">Ability Scores</label>
            <div id="md-abscores" class="row justify-content-center">
                <div style=""
                    class="col-3 col-xxl shadow rounded text-center bg-secondary-subtle text-secondary-emphasis m-1 py-1"
                    v-for="(v, key) in $md.ply.stats.ability">
                    <div class="" style="font-size: 14px;">{{ abName(key) }}</div>
                    <div class="fs-3 text-white">{{ $md.ply.stats.ability_mod[key] }}</div>
                    <div class="">{{ v }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AbilityScores",
    methods: {
        abName: (key) => {
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
                    return "Score";
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>