<template>
    <div class="fixed-bottom">
        <div class="d-flex justify-content-around nav-mobile py-2 fs-3 text-muted px-3">
            <router-link class="nav-link" :to="`/player/${$md.ply.id}/`">
                <div class="d-flex flex-column text-center px-3">
                    <i class="bi bi-house-fill"></i>
                    <span>Dashboard</span>
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