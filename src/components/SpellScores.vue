<template>
    <div>
        <div id="md-abscores" class="d-flex justify-content-center">
            <div style="" class="shadow rounded bg-body-secondary text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3 spl_mod">{{ $md.ply.magic.Mod }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellcasting Ability</div>
            </div>
            <div style="" class="shadow rounded bg-body-secondary text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3 spl_mod">{{ $md.ply.magic.DC }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellsave DC</div>
            </div>
            <div style="" @click="roll($md.ply.magic.SPAttack)"
                class="shadow rounded bg-body-secondary text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3 spl_mod">{{ $md.ply.magic.SPAttack }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellattack Bonus</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SpellScores",
    methods: {
        roll(v) {
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
                    note: `Spell Attack Roll`               // Initialize empty note string
                });
                this.$md.savePlayer(); // Save to localStorage immediately
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>