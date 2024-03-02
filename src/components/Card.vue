<template>
    <div class="card bg-secondary-subtle border-0 shadow m-1 overflow-hidden">
        <div class="card-banner" v-if="bgImage" :style="{ backgroundImage: getBg(bgImage) }"></div>
        <div class="card-body p-4">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "Card",
    props: {
        bgImage: String
    },
    methods: {
        getBg: (img) => {
            if (img)
                return 'url(' + require('@/assets/img/' + img) + ')';
            else
                return 'none';
        }
    }
}
</script>

<style lang="scss" scoped>
.card-banner {
    height: 3.5rem;
    background-size: cover;
    background-position: center;
}
</style>