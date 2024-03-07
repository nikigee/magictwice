<template>
    <NavBar />
    <div class="container" v-if="ply">
        <div class="row">
            <div class="col-md-3 mb-3">
                <div class="text-center">
                    <img :src="$md.ply.render.avatar" class="img-fluid shadow rounded d-none d-md-block mx-auto"
                        style="max-height: 500px;" />
                    <div v-if="$md.ply.render.avatar"
                        :style="{ backgroundImage: 'url(' + $md.ply.render.avatar + ')', backgroundSize: 'cover' }"
                        style="height: 250px; width: 250px; border-radius: 50%;"
                        class="img-fluid border border-light shadow d-block d-md-none mx-auto"></div>
                </div>
                <PlayerBio />
            </div>
            <div class="col">
                <div class="row">
                    <Banner />
                </div>
                <div class="row pt-2">
                    <div class="col-lg-7">
                        <HealthBar class="mb-3" />
                        <AbilityScores />
                        <SpellScores v-if="$md.ply.magic.spcMod" class="mb-3 mx-2" />
                        <DiceRoller />
                    </div>
                    <div class="col-lg">
                        <Stats class="mt-1" />
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
import Stats from '../components/Stats.vue';
import PlayerBio from '../components/PlayerBio.vue';
import Card from '../components/Card.vue';
import DiceRoller from '../components/DiceRoller.vue';
import Banner from '../components/Banner.vue';

export default {

    data() {
        return {
            ply: null
        }
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        this.ply = player;
    },
    components: {
        NavBar: NavBar,
        HealthBar: HealthBar,
        AbilityScores: AbilityScores,
        SpellScores: SpellScores,
        Stats: Stats,
        PlayerBio: PlayerBio,
        Card: Card,
        DiceRoller: DiceRoller,
        Banner: Banner
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