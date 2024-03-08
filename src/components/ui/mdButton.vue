<template>
    <button class="button btn btn-outline-primary px-2 py-1 mx-1 text-uppercase">
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