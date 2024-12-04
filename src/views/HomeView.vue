<template>
    <div class="home container text-center">
        <div class="position-absolute top-50 start-50 translate-middle">
            <img style="width: 10rem;" :src="require('@/assets/img/mdtwicelogo.png')" />
            <h1 class="display-1 mb-0 col text-nowrap">Magic Dice</h1>
            <p class="lead text-end mb-0">2nd Edition</p>
            <div class="list-group mt-2">
                <!-- <a href="#" class="list-group-item list-group-item-action" v-on:click="LoadCharacter">Run {{
                    Teagan.name }}</a> -->
                <a href="#" class="list-group-item list-group-item-action">Create Character</a>
                <router-link to="/load" class="list-group-item list-group-item-action">Load Character</router-link>
                <a href="#" class="list-group-item list-group-item-action">About</a>
            </div>
        </div>
    </div>
</template>

<script>
import { Teagan } from '@/assets/Teagan.js';

export default {
    methods: {
        LoadCharacter() {
            this.$md.magicHandler.managed_players = [];
            this.$md.Load.restoreFromObj(this.Teagan);
            this.$md.magicHandler.last.self;
            this.$md.savePlayer();
        }
    },
    data() {
        return {
            Teagan: Teagan
        }
    }
}

</script>