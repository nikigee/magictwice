<template>
    <div v-if="$md.ply.render.avatar">
        <img :src="$md.ply.render.avatar" class="img-avatar img-fluid shadow rounded d-none d-md-block mx-auto"
            style="max-height: 500px;" />
        <div :style="{ backgroundImage: 'url(' + $md.ply.render.avatar + ')', backgroundSize: 'cover' }"
            style="height: 250px; width: 250px; border-radius: 50%;"
            class="mobile-avatar img-fluid border border-light shadow d-block d-md-none mx-auto mb-2"></div>
    </div>
    <div v-else class="pt-5 pt-md-0">
        <div class="wrapper rounded d-none d-md-block">
            <div class="noavatar">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Avatar"
}
</script>

<style lang="css" scoped>
.noavatar {
    height: 400px;
    background: radial-gradient(circle at 30% 30%, var(--bs-primary), transparent 40%),
        radial-gradient(circle at 70% 40%, var(--bs-secondary), transparent 40%),
        radial-gradient(circle at 40% 70%, var(--bs-primary), transparent 40%),
        radial-gradient(circle at 80% 80%, var(--bs-secondary), transparent 40%);
    /* background: var(--default-banner) center center; */
    /* background-size: cover; */
    filter: blur(110px);
}

.wrapper {
    overflow: hidden;
}
</style>