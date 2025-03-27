<template>
    <NavBar class="shadow" />
    <div class="banner-img">
        <div class="banner"></div>
    </div>
    <div class="container pt-3">
        <h1 class="display-4 spell-heading">Spells</h1>
        <div class="d-flex spell-buttons align-items-center">
            <div class="text-muted me-3 spell-button">
                <i class="bi bi-plus-circle"></i>
            </div>
            <div class="text-muted spell-button">
                <i class="bi bi-three-dots"></i>
            </div>
        </div>
        <!-- no spells? -->
        <div class="mt-2" v-if="$md.ply.magic.spells.size == 0">
            <hr class="hr" />
            <p class="lead">Your character doesn't have any spells.</p>
        </div>
        <div class="spell-table mb-5 mt-4">
            <div v-for="group in getSpellsByLevel($md.ply.magic.spells)">
                <h3 class="text-capitalize h5">{{ group[0] }} Level</h3>
                <hr class="m-0 mb-2" />
                <ul class="list-group list-group-flush mb-3">
                    <!-- Table Header -->
                    <div class="px-3">
                        <div class="row lato-bold text-uppercase" style="font-size: 13px;">
                            <div class="col">Name</div>
                            <div class="col">Casting Time</div>
                            <div class="col d-none d-sm-block">Duration</div>
                            <div class="col d-none d-sm-block">Range / Area</div>
                            <div class="col-4 d-none d-md-block">Description</div>
                        </div>
                    </div>
                    <!-- Spell details -->
                    <div class="my-1 py-2 spell-item" v-for="spell in group[1]">
                        <router-link class="text-decoration-none d-block p-3 py-0 spell-link"
                            :to="`/player/${$md.ply.id}/spell/${spell.id}`">
                            <div class="row align-items-center">
                                <div class="col text-primary">{{ spell.name }}</div>
                                <div class="col">{{ spell.ctime.length >= 27 ? spell.ctime.slice(0, 26) + "..." :
                                    spell.ctime }}</div>
                                <div class="col d-none d-sm-block">{{ spell.duration }}</div>
                                <div class="col d-none d-sm-block">{{ spell.range }}</div>
                                <div class="col-4 text-muted d-none d-md-block" style="font-size: 15px;">{{
                                    spell.description.slice(0, 60) }}...</div>
                            </div>
                        </router-link>
                    </div>
                </ul>
            </div>
        </div>
    </div>
    <MobileNavBar />
</template>

<script setup>
import MobileNavBar from '../components/MobileNavBar.vue';
import NavBar from '../components/NavBar.vue';

function getSpellsByLevel(spells) {
    // arr = {
    //     lvl: "cantrip",
    //     spells: []
    // }
    let arr = new Map();
    spells.forEach(element => {
        // if that level exists in the map, add it to that levels list of spells
        const lvl = element.level.toLowerCase();
        if (arr.has(lvl)) {
            arr.get(lvl).push(element);
        } else {
            arr.set(lvl, []); // else, create new array at this location.
            arr.get(lvl).push(element);
        }
    });
    return arr;
}
</script>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player) {
            this.$md.Load.restoreFromObj(player);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/magicdice.scss";

.banner {
    background: linear-gradient(to bottom, #00000000, $body-bg-dark);
    height: 18vh;
}

.banner-img {
    background: url("../assets/img/bg/4.jpg") center center;
    background-size: cover;
}

.spell-heading {
    letter-spacing: 0.5rem;
    text-transform: uppercase;
}

.spell-button{
    cursor: pointer;
    font-size: 32px;
    text-align: center;
}

.spell-button:hover{
    color: $white !important;
}

.spell-item:hover {
    box-shadow: 0px 0px 5px $md-accent !important;
    transition: 0.7s;
    filter: brightness(1.2);
}

.spell-link {
    color: initial;
}
</style>