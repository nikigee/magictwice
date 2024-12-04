<template>
    <button class="button btn btn-outline-primary px-3 py-2 mx-1 text-uppercase">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "mdButton"
}
</script>

<style lang="scss" scoped>
.button {
    font-size: 12px;
    // font-weight: bold;
    // font-family: 'Roboto', sans-serif;
}
</style>

<style lang="css">
.button i{
    margin-right: 0.4rem;
}
</style>