<template>
    <NavBar />
    <div class="container" v-if="ply">
        <div class="row">
            <div class="col-md-5 col-lg-4 col-xl-3 mb-3">
                <div class="text-center">
                    <Avatar />
                </div>
                <PlayerBio />
            </div>
            <div class="col">
                <Alert />
                <div class="row mx-0">
                    <Banner />
                </div>
                <div class="row pt-2">
                    <div class="col-lg-7 mb-3">
                        <div class="text-end">
                            <div class="dropdown dropcenter">
                                <i class="bi bi-three-dots text-body-secondary" data-bs-toggle="dropdown"></i>
                                <ul class="dropdown-menu">
                                    <li class="dropdown-item" @click="editScores = true">
                                        <i class="bi bi-pencil-square me-1"></i> Edit Information
                                    </li>
                                    <li class="dropdown-item" data-bs-toggle="modal" data-bs-target="#quickRolls">
                                        <i class="bi bi-dice-5 me-1"></i> Quickrolls
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
    <Footerr />
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
import Avatar from '../components/Avatar.vue';
import Alert from '@/components/Alert.vue';
import Footerr from '@/components/Footerr.vue';

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
    mounted() {
        document.title = this.$md.ply.name;

        if (localStorage) {
            localStorage.setItem("last_played", this.$md.ply.id);
        }
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
        MobileNavBar,
        Avatar,
        Alert,
        Footerr
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

<style lang="scss" scoped>
li {
    cursor: pointer;
}
</style>