<template>
    <div>
        <div>
            <h1 class="h2 mt-2 mb-1">{{ $md.ply.name }}</h1>
            <p class="text-body-secondary mb-0"> {{ $md.ply.player_class.name }} - Level {{ $md.ply.lvl }}</p>
            <p><span class="text-body-secondary">XP: </span>{{ $md.ply.exp }}</p>
            <div class="row justify-content-between mt-2">
                <div class="col-3">
                    <label class="text-body-secondary">AC</label>
                    <p class="fw-bold fs-3 m-0">{{ $md.ply.health.defaultAC }}</p>
                </div>
                <div class="col-3">
                    <label class="text-body-secondary">Initiative</label>
                    <p class="fw-bold fs-3 m-0">{{ $md.ply.stats.initiative }}</p>
                </div>
                <div class="col-3">
                    <label class="text-body-secondary">Speed</label>
                    <p class="fw-bold fs-3 m-0">{{ $md.ply.stats.speed }}</p>
                </div>
            </div>
        </div>
        <div class="row py-1 mt-2 align-items-center">
            <span class="text-body-secondary col">Proficiency Bonus: </span><span class="col-3 text-start">{{
                $md.ply.stats.prof }}</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Passive Perception: </span><span class="col-3 text-start">{{
                $md.ply.stats.passive_perception }}</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Gold: </span><span class="col-3 text-start">{{ $md.ply.inv.gold
            }} GP</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlayerBio"
}
</script>

<style lang="scss" scoped></style>