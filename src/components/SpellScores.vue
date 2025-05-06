<template>
    <div>
        <div id="md-abscores" class="d-flex justify-content-center">
            <div style=""
                class="shadow rounded bg-body-secondary text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3">{{ $md.ply.magic.Mod }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellcasting Ability</div>
            </div>
            <div style=""
                class="shadow rounded bg-body-secondary text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3">{{ $md.ply.magic.DC }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellsave DC</div>
            </div>
            <div style="" @click="roll($md.ply.magic.SPAttack)"
                class="shadow rounded bg-body-secondary text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3">{{ $md.ply.magic.SPAttack }}</div>
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
            this.$md.diceHistory.push(this.$md.Dice.x("d20+" + v)); // roll and save
        }
    }
}
</script>

<style lang="scss" scoped></style>