<template>
    <div class="container mt-5">
        <div class="text-start my-3">
            <router-link to="/" class="text-decoration-none">
                <i class="bi bi-arrow-left"></i> Back
            </router-link>
        </div>
        <div class="text-center">
            <h1 class="display-1 mb-0 col text-nowrap">Magic Dice</h1>
            <p class="lead">2nd Edition</p>
        </div>
        <hr />
        <div class="row">
            <div class="col-md-5 mb-3">
                <div class="text-center">
                    <img src="../assets/img/af0ae5b4def62a32adfd5cf102c799a4.jpg"
                        class="img-fluid shadow rounded profile" alt="Profile Picture" />
                </div>
                <p class="text-muted m-0 text-end">- literally me</p>
                <p class="m-0">art credit: <a href="https://x.com/ziriii_zireael/status/1830174794412871898"
                        target="_blank">@ziriii_zireael</a></p>
                <p class="m-0">contact me on discord: <a href="https://discord.com/" target="_blank">@nikigee</a></p>
                <p>...or by email: <a href="mailto:ngolev.bus@gmail.com">ngolev.bus@gmail.com</a></p>
            </div>
            <div class="col fs-5">
                <p>
                    Hey! You're looking at a digital player sheet I made for dnd 5th edition.
                </p>
                <p>
                    It's a website I made for myself because I wanted something with a lot less hassle than pen and
                    paper and the existing digital solutions just really didn't work for me. For me, this offers
                    automation without being too bulky (plus, it's just fun to work on).
                </p>
                <p>
                    It started out as a basic JS script I made back in 2018 and I've just slowly been adding to it with
                    time -- This website being a total remake of that one, hence "2nd edition" :P
                </p>
                <p>I hope it serves you well!</p>
                <h3 class="h3 text-primary">Tips and Tricks</h3>
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
            </div>
        </div>
        <div class="text-muted py-3">
            © 2025 Magic Dice
        </div>

    </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(()=>{
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