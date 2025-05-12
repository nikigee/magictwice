<template>
    <div class="home container text-center">
        <div class="position-absolute top-50 start-50 translate-middle">
            <img style="width: 10rem;" :src="require('@/assets/img/mdtwicelogo.png')" />
            <h1 class="display-1 mb-0 col text-nowrap">Magic Dice</h1>
            <p class="lead text-end mb-0">2nd Edition</p>
            <div class="list-group mt-2">
                <router-link to="/create" class="list-group-item list-group-item-action">Create Character</router-link>
                <router-link to="/load" class="list-group-item list-group-item-action">Load Character</router-link>
                <router-link to="/about" class="list-group-item list-group-item-action">About</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

// clear theme
onMounted(()=>{
    document.documentElement.removeAttribute("data-theme");
});

</script>