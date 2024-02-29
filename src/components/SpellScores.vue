<template>
    <div>
        <div id="md-abscores" class="d-flex justify-content-center">
            <div style="max-width: 130px;"
                class="shadow rounded bg-secondary-subtle text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3">{{ $md.ply.magic.Mod }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellcasting Ability</div>
            </div>
            <div style="max-width: 130px;"
                class="shadow rounded bg-secondary-subtle text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3">{{ $md.ply.magic.DC }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellsave DC</div>
            </div>
            <div style="max-width: 130px;"
                class="shadow rounded bg-secondary-subtle text-center m-1 p-0 flex-fill overflow-hidden">
                <div class="fs-3">{{ $md.ply.magic.SPAttack }}</div>
                <div class="text-secondary-emphasis py-1" style="font-size: 14px;">Spellattack Bonus</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SpellScores"
}
</script>

<style lang="scss" scoped></style>