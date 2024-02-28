<template>
    <NavBar />
    <div class="container" v-if="ply">
        <div class="row">
            <div class="col-3">
                <img :src="ply.renderData.avatar" class="img-fluid shadow rounded" />
                <h1 class="h2 mt-2 mb-1">{{ ply.name }}</h1>
                <p class="text-body-secondary mb-1"> {{ ply.classData.name }} - Level {{ ply.lvl }}</p>
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
                        :style="{ backgroundImage: 'url(' + require('@/assets/img/bg/3.jpg') + ')', width: '100%', height: '10rem', backgroundSize: 'cover', backgroundPosition: 'center' }">
                    </div>
                </div>
                <div class="row">
                    <div class="col-7">

                        <div class="">
                            <h1>Stuff</h1>
                        </div>
                    </div>
                    <div class="col">
                        <h3 class="">Stats</h3>
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
        NavBar: NavBar
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