<template>
    <div class="mb-2">
        <label for="md-healthbar" class="text-body-secondary">Health Points</label>
        <div id="md-healthbar" class="bg-dark-subtle rounded overflow-hidden">
            <div class="p-1 bg-success text-white text-center"
                :style="{ width: ($md.ply.health.currentHP / $md.ply.health.maxHP * 100) + '%' }">
                <span style="text-wrap: nowrap">{{ $md.ply.health.currentHP }} / {{ $md.ply.health.maxHP }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HealthBar"
}
</script>

<style lang="scss" scoped></style>