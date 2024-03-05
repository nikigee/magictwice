<template>
    <NavBar />
    <div class="container">
        <h1>Spellbook</h1>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
    data() {
        return {
            ply: null
        }
    },
    components: {
        NavBar: NavBar
    },
    created() {
        const player = JSON.parse(localStorage.charList)[this.$route.params.id];
        if (player)
            this.$md.Load.restoreFromObj(player);
        this.ply = player;
    }
}
</script>

<style lang="scss" scoped></style>