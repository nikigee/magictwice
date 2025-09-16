<template>
    <div class="container mt-5">
        <div class="text-start my-3">
            <router-link to="/" class="text-decoration-none">
                <i class="bi bi-arrow-left"></i> Back
            </router-link>
        </div>
        <div class="text-center text-md-start">
            <h1 class="display-1 mb-0 col text-nowrap">Magic Dice</h1>
            <p class="lead">2nd Edition</p>
        </div>
        <hr />
        <div class="row">
            <!-- Left Side -->
            <div class="col-md-4 mb-3">
                <div class="text-center">
                    <img src="../assets/img/joydebolle.jpg" class="img-fluid shadow rounded profile"
                        alt="Profile Picture" />
                </div>
                <p class="text-muted m-0 text-end">- random art of mine</p>
                <p class="m-0">contact me on discord: <a href="https://discord.com/" target="_blank">@nikigee</a></p>
                <p>...or by email: <a href="mailto:ngolev.bus@gmail.com">ngolev.bus@gmail.com</a></p>
            </div>
            <!-- Right side -->
            <div class="col fs-5">
                <h2 class="h2 text-primary">About</h2>
                <p>
                    Hey! You're looking at a digital player sheet I made for dnd 5th edition.
                </p>
                <p>
                    It's a website I made for myself because I wanted something with a lot less hassle than pen and
                    paper and the existing digital solutions just really didn't work for me. For me, this offers
                    automation without being too bulky (plus, it's just fun to work on).
                </p>
                <p>
                    Magic Dice started out as a basic JS script I made back in 2018 which then turned into a website --
                    This version being a total remake of that one, hence "2nd edition" :P
                </p>
                <p>I hope it serves you well!</p>
                <h2 class="h2 text-primary">Tips and Tricks</h2>
                <p class="text-muted fs-6">(random hidden features which may be of use to you)</p>
                <ul>
                    <li>Typing "quickroll" into the dice tray followed by a diceroll e.g.
                        <code>quickroll d10 + str</code> will bookmark that roll to be quickly rolled whenever you want.
                    </li>
                    <li>Almost anywhere you can simply type an attribute short hand:
                        <code>str, dex, cnst, int, wis, chr</code>, instead of the number itself.
                    </li>
                    <li>Highly recommend you export your character frequently. No one wants to lose their hard work! I
                        put back-ups of all my characters in a cloud storage like OneDrive.</li>
                </ul>
                <h2 class="h2 text-primary">Credits</h2>
                <p class="text-muted fs-6">A list of everything used in this project:</p>
                <ul class="fs-6">
                    <li>Logo design: <span class="text-primary">Alex Marshall</span></li>
                    <li>Default banner art: <span class="text-primary">Spooky - Dmitry Zaviyalov</span></li>
                    <li>Cyberpunk banner art: <span class="text-primary">Ghost in The Shell - Ash Thorp</span></li>
                    <li>Art: <span class="text-primary">To camp - lok du</span></li>
                    <li>404 Page Art: <span class="text-primary">denimcatfish</span></li>
                    <li>Art: <span class="text-primary">HK 2040 - Gianluigi Di Giacomo</span></li>
                    <li>Art: <span class="text-primary">Project War of Crown - Dora-G</span></li>
                </ul>
            </div>
        </div>
    </div>
    <Footerr />
</template>

<script setup>
import Footerr from "@/components/Footerr.vue";
import { onMounted } from "vue";

onMounted(() => {
    document.title = "About - Magic Dice";
})
</script>

<style type="scss" scoped>
@media only screen and (max-width: 600px) {
    .profile {
        border: white solid 3px;
        max-height: 400px;
        margin-bottom: 1rem;
    }
}

a {
    text-decoration: none;
}
</style>