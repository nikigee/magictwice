<template>
    <NavBar />
    <div class="container" v-if="$md.ply">
        <div class="row g-5 mb-4">
            <!-- <div class="col-3">
                <img class="img-fluid rounded box-shadow" src="https://i.imgur.com/59h582H.jpeg" />
            </div> -->
            <!-- no spell selected menu -->
            <div class="col-3 box-shadow background d-none d-lg-block">
            </div>
            <div class="col col-lg-9">
                <h1 class="mb-3 text-uppercase spellbook h2">List of Spells</h1>
                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control form-control-lg" placeholder="Search Spells..."
                        aria-label="Spell Name" aria-describedby="basic-addon1" v-model="filter">
                </div>
                <!-- no spells? -->
                <div class="mt-2" v-if="$md.ply.magic.spells.size == 0">
                    <hr class="hr" />
                    <p class="lead">Your character doesn't have any spells.</p>
                </div>
                <div class="row">
                    <SpellList class="col" :filter="filter" />
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
import SpellList from '@/components/SpellList.vue';

export default {
    data() {
        return {
            ply: null,
            selectedSpell: null,
            filter: ""
        }
    },
    components: {
        NavBar: NavBar,
        SpellList: SpellList
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        this.ply = player;
    }
}
</script>

<style lang="scss" scoped>
.spellbook {
    letter-spacing: .4rem;
}

.background {
    position: relative;
    background: url('../assets/img/magicart.jpg') center center;
    background-size: cover;
    border-radius: 5px;
    min-height: 800px;
    max-height: 1000px;
}

.background::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(16, 16, 19, 0.2);
    /* Adjust opacity as needed */
    border-radius: 5px;
    /* Ensure the same border radius as the main element */
}
</style>