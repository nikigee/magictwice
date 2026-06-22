<template>
    <div>
        <div class="mb-2">
            <label for="md-abscores" class="text-body-secondary">Ability Scores</label>
            <div id="md-abscores" class="row justify-content-center">
                <div style=""
                    class="col-3 col-xxl shadow rounded text-center bg-body-secondary text-secondary-emphasis m-1 py-1"
                    @click="roll($md.ply.stats.ability_mod[key], abName(key))"
                    v-for="(v, key) in $md.ply.stats.ability">
                    <div class="" style="font-size: 14px;">{{ abName(key) }}</div>
                    <div class="fs-3 text-white ability_mod">{{ $md.ply.stats.ability_mod[key] }}</div>
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
        },
        roll(v, ability) {
            const result = this.$md.Dice.x(`d20+${v}`);

            // 1. Push to the short-term Dice Tray
            this.$md.diceHistory.push(result);

            // 2. Push to the Character's persistent History Log
            if (this.$md.ply) {
                if (!this.$md.ply.dice_history) this.$md.ply.dice_history = [];

                this.$md.ply.dice_history.push({
                    dice: result.dice,
                    compText: result.compText,
                    total: result.total,
                    max: result.max,
                    timestamp: Date.now(), // Add the timestamp
                    note: `${ability} Check`               // Initialize empty note string
                });
                this.$md.savePlayer(); // Save to localStorage immediately
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>