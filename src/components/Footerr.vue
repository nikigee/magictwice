<template>
    <footer class="mt-auto container">
        <div class="pb-4">
            <hr />
            <div class="row">
                <div class="col">
                    <div class="d-md-inline">
                        <span class="text-muted text-nowrap">&copy; 2025 Magic Dice</span>
                    </div>
                    <div class="d-md-inline d-print-none">
                        <span><a href="/">Home</a></span>
                        <span><router-link to="/about/">About</router-link></span>
                    </div>
                </div>
                <div class="col text-end d-flex align-items-center justify-content-end">
                    <img src="../assets/logo.png" style="height: 30px;">
                </div>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
span,
img {
    margin-left: 1rem;
    margin-right: 1rem;
    vertical-align: middle;
}

a {
    text-decoration: none;
    color: inherit;
}

a:hover {
    color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1));
}
</style>