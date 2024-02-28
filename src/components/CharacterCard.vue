<template>
    <div class="col" style="max-width: 280px">
        <div class="card">
            <div class="bg-image"
                :style="{ 'background-image': 'url(' + char.renderData.avatar + ')', height: '15rem', backgroundPosition: 'center top', backgroundSize: 'cover' }">
            </div>
            <div class="card-body">
                <router-link class="text-decoration-none" :to="'/player/' + link">
                    <h4 class="card-title">{{ char.name }}</h4>
                </router-link>
                <p class="card-text text-body-secondary">Level {{ char.lvl }} {{ char.classData.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CharacterCard',
    props: {
        char: Object,
        link: String
    }
}
</script>

<style lang="scss" scoped></style>