<template>
    <NavBar />
    <div class="container" v-if="ply">
        <div class="row">
            <div class="col-md-3 mb-3">
                <div class="text-center">
                    <img :src="ply.renderData.avatar" class="img-fluid shadow rounded d-none d-md-block"
                        style="max-height: 500px;" />
                </div>
                <div>
                    <h1 class="h2 mt-2 mb-1">{{ ply.name }}</h1>
                    <p class="text-body-secondary mb-0"> {{ ply.classData.name }} - Level {{ ply.lvl }}</p>
                    <p><span class="text-body-secondary">XP: </span>{{ ply.exp }}</p>
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
                    <span class="text-body-secondary col-9">Proficiency Bonus: </span><span class="col-3 text-start">{{
                        $md.ply.stats.prof }}</span>
                </div>
                <div class="row py-1 align-items-center">
                    <span class="text-body-secondary col-9">Passive Perception: </span><span class="col-3 text-start">{{
                        $md.ply.stats.passive_perception }}</span>
                </div>
                <div class="row py-1 align-items-center">
                    <span class="text-body-secondary col-9">Gold: </span><span class="col-3 text-start">{{ $md.ply.inv.gold
                    }} GP</span>
                </div>
            </div>
            <div class="col">
                <div class="row">
                    <div class="rounded"
                        :style="{ backgroundImage: 'url(' + require('@/assets/img/bg/3.jpg') + ')', maxWidth: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: 'center' }">
                    </div>
                </div>
                <div class="row pt-2">
                    <div class="col-lg-7">
                        <HealthBar class="mb-3" />
                        <AbilityScores />
                        <SpellScores v-if="$md.ply.magic.spcMod" class="mb-3 mx-2" />
                    </div>
                    <div class="col-lg">
                        <h4 class="">Saving Throws</h4>

                        <h4>Skills</h4>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="container" v-else>
        <h1>Sorry, this character doesn't exist :C</h1>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import HealthBar from '@/components/HealthBar.vue';
import AbilityScores from '@/components/AbilityScores.vue';
import SpellScores from '@/components/SpellScores.vue';

export default {

    data() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        return {
            ply: player
        }
    },
    components: {
        NavBar: NavBar,
        HealthBar: HealthBar,
        AbilityScores: AbilityScores,
        SpellScores: SpellScores
    },
    watch: {
        $route(to, from) {
            const player = JSON.parse(localStorage.charList)[this.$route.params.id];
            if (player)
                this.$md.Load.restoreFromObj(player);
            this.ply = player;
        }
    }

}
</script>

<style lang="scss" scoped></style>