<template>
    <div class="col-3">
        <div class="card">
            <img :src="char.renderData.avatar" class="card-img-top">
            <div class="card-body">
                <router-link :to="'/player/'+link">
                    <h5 class="card-title">{{ char.name }}</h5>
                </router-link>
                <p class="card-text">Level {{ char.lvl }} {{ char.classData.name }}</p>
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