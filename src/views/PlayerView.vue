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
                        class="img-fluid border border-light shadow d-block d-md-none mx-auto mb-2"></div>
                </div>
                <PlayerBio />
            </div>
            <div class="col">
                <div class="row">
                    <Banner />
                </div>
                <div class="row pt-2">
                    <div class="col-lg-7 mb-3">
                        <div class="text-end">
                            <div class="dropdown dropcenter">
                                <i class="bi bi-three-dots text-body-secondary" data-bs-toggle="dropdown"></i>
                                <ul class="dropdown-menu">
                                    <li class="dropdown-item" @click="editScores = true">
                                        Edit Information
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-if="!editScores">
                            <HealthBar class="mb-3" />
                            <AbilityScores />
                            <SpellScores v-if="$md.ply.magic.spcMod" class="mb-3 mx-2" />
                        </div>
                        <EditScores class="mb-2" v-if="editScores" />
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
    <MobileNavBar />
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import HealthBar from '@/components/HealthBar.vue';
import AbilityScores from '@/components/AbilityScores.vue';
import SpellScores from '@/components/SpellScores.vue';
import Stats from '../components/Stats.vue';
import PlayerBio from '../components/PlayerBio.vue';
import DiceRoller from '../components/DiceRoller.vue';
import Banner from '../components/Banner.vue';
import EditScores from '../components/EditScores.vue';
import MobileNavBar from '../components/MobileNavBar.vue';

export default {

    data() {
        return {
            editScores: false,
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
        DiceRoller: DiceRoller,
        Banner: Banner,
        EditScores: EditScores,
        MobileNavBar
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

<style lang="scss" scoped></style>../components/ui/Card.vue