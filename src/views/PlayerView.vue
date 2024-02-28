<template>
    <NavBar />
    <div class="container" v-if="ply">
        <div class="row">
            <div class="col-3">
                <img :src="ply.renderData.avatar" class="img-fluid shadow-sm" />
                <h1 class="h2 mt-2 mb-1">{{ ply.name }}</h1>
                <p class="text-body-secondary"> {{ ply.classData.name }} - Level {{ ply.lvl }}</p>
            </div>
            <div class="col"></div>
            <div class="col"></div>
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