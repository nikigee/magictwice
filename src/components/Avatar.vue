<template>
    <div>
        <img :src="$md.ply.render.avatar" class="img-fluid shadow rounded d-none d-md-block mx-auto"
            style="max-height: 500px;" />
        <div v-if="$md.ply.render.avatar"
            :style="{ backgroundImage: 'url(' + $md.ply.render.avatar + ')', backgroundSize: 'cover' }"
            style="height: 250px; width: 250px; border-radius: 50%;"
            class="img-fluid border border-light shadow d-block d-md-none mx-auto mb-2"></div>
    </div>
</template>

<script>
export default {
    name: "Avatar"
}
</script>