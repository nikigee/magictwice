<script setup>
import Footerr from '@/components/Footerr.vue';

</script>

<template>
    <div class="container text-center py-5">
        <div>
            <img src="../assets/img/bg3.jpeg" alt="404 Not found" class="img-fluid shadow rounded notfound" />
            <p>credit <a href="https://x.com/denimcatfish/status/1787280769905553613?t=5AAP5rnj-EBWHL0sbr0rSg&s=19" target="_blank">@denimcatfish</a></p>
        </div>
        <h1 class="display-1 fw-bold text-primary">404</h1>
        <p class="fs-3"> <span class="text-primary">Oops!</span> Page not found.</p>
        <p class="lead">
            The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a href="/">Go Home</a>
    </div>
    <Footerr />
</template>

<style scoped>
/* Optional: Make it vertically centered */
.container {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.container a{
    text-decoration: none;
}

.notfound {
    width: 60%;
    max-width: 400px;
}
</style>