<template>
    <div style="height: 50px;" class="d-block d-sm-none"></div>
    <div class="fixed-bottom d-block d-sm-none" v-if="$md.ply">
        <div class="d-flex justify-content-around nav-mobile py-2 fs-3 text-muted px-3">
            <router-link class="nav-link" :to="`/player/${$md.ply.id}/`">
                <div class="d-flex flex-column text-center px-3">
                    <i class="bi bi-house-fill"></i>
                    <span>Home</span>
                </div>
            </router-link>
            <router-link class="nav-link" :to="`/player/${$md.ply.id}/notes/`">
                <div class="d-flex flex-column text-center px-3">
                    <i class="bi bi-stickies-fill"></i>
                    <span>Notes</span>
                </div>
            </router-link>
            <router-link class="nav-link" :to="`/player/${$md.ply.id}/spells/`">
                <div class="d-flex flex-column text-center px-3">
                    <i class="bi bi-magic"></i>
                    <span>Spells</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// @import "@/assets/magicdice.scss";

.nav-mobile {
    background: linear-gradient(to bottom, #00000000, black);
}

.nav-mobile span {
    font-size: 12px;
    // font-family: 'Lato', sans-serif;
}

.router-link-active {
  color: white; /* Highlight color */
}
</style>

<script>
export default {
    name: 'NavBarMobile'
}
</script>