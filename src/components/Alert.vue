<template>
    <div id="playerAlert" class="d-print-none">
    </div>
</template>

<style lang="scss">
#playerAlert {
    .mascot-alert {
        min-height: 96px;
    }

    .alert-mascot {
        width: 125px;
        min-height: 96px;
        background-image: var(--alert-mascot);
        background-size: cover;
        background-position: center 18%;
        border-right: 2px solid currentColor;
        clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
    }

    .alert-dialogue {
        font-size: 1.1rem;
        line-height: 1.4;
    }
}
</style>
