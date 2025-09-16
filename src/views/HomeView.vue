<template>
    <div class="home text-center">
        <video class="bg-video d-none d-md-block" autoplay muted loop playsinline @canplaythrough="showVideo">
            <source src="../assets/img/bg/bg.mp4" type="video/mp4" />
        </video>

        <!-- <div class="bg-fallback"></div> -->

        <!-- Foreground content -->
        <div class="position-absolute top-50 start-50 translate-middle content">
            <img style="width: 10rem;" :src="require('@/assets/img/mdtwicelogo.png')" />
            <h1 class="display-1 mb-0 col text-nowrap">Magic Dice</h1>
            <p class="lead text-end mb-0">2nd Edition</p>
            <div class="list-group mt-3">
                <router-link to="/create" class="list-group-item list-group-item-action">Create Character</router-link>
                <router-link to="/load" class="list-group-item list-group-item-action">Load Character</router-link>
                <router-link to="/about" class="list-group-item list-group-item-action">About</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const bgVideo = ref(null);

function showVideo() {
    const video = document.querySelector(".bg-video");
    if (video) {
        video.classList.add("visible");
    }
}

onMounted(() => {
    document.documentElement.removeAttribute("data-theme");
    document.title = "Magic Dice";
});
</script>

<style lang="css" scoped>
.home {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

/* Background video - starts hidden */
.bg-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    opacity: 0;
    transition: opacity 2s ease;
}

/* When ready, fade in */
.bg-video.visible {
    opacity: 1;
}

/* Fallback background */
.bg-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("../assets/img/bg/2.jpg") center center;
    background-size: cover;
    z-index: -1;
}

/* Content above video */
.content {
    z-index: 1;
    position: relative;
    color: white;
}

.content h1, .content .lead{
    text-shadow: 0 0px 5px rgba(255, 255, 255, 0.7);
}

.list-group-item {
    background: none;
    border-color: white;
}
</style>
