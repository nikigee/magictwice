<template>
    <div v-if="!editMode">
        <!-- Edit Avatar -->
        <div class="my-3" v-if="showPhotoForm">
            <!-- File Upload for Avatar -->
            <input type="file" @change="onAvatarFileChange" class="form-control form-control-sm mb-1" />
            <input type="text" v-model="avatarUrlInput" class="form-control form-control-sm" placeholder="image url" />

            <div class="mt-2 text-center text-lg-start">
                <mdButton class="ms-0" @click="changeAvatarUrl">Set</mdButton>
                <mdButton class="me-0 btn-outline-secondary" @click="cancelPhotoForm">Cancel</mdButton>
            </div>
        </div>
        <!-- Name -->
        <div class="d-flex my-1 align-items-center justify-content-between">
            <h1 class="h2 py-1 m-0">{{ $md.ply.name }}</h1>
            <!-- Dropdown Options -->
            <div class="dropdown dropcenter">
                <button class="btn fs-4 p-0 px-2 text-muted" data-bs-toggle="dropdown" aria-expanded="false"><i
                        class="bi bi-three-dots"></i></button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item" @click="openPhotoForm">
                        <i class="bi bi-image me-1"></i> Choose Photo
                    </li>
                    <li class="dropdown-item" @click="editMode = true">
                        <i class="bi bi-pencil-square me-1"></i> Edit Information
                    </li>
                    <li class="dropdown-item" @click="$md.ply.saveToFile()">
                        <i class="bi bi-download me-1"></i> Export (.json)
                    </li>
                </ul>
            </div>
        </div>
        <!-- Important Info -->
        <p class="text-body-secondary mb-0"> {{ $md.ply.player_class.name }} - Level {{ $md.ply.lvl }}</p>
        <p>
        <div v-if="$md.ply.exp !== 0"><span class="text-body-secondary">XP: </span>{{ $md.ply.exp }}</div>
        </p>
        <!-- Additional Player Info ... -->
        <div class="row justify-content-between mt-2">
            <div class="col-3">
                <label class="text-body-secondary">AC</label>
                <p class="fw-bold fs-3 m-0">{{ $md.ply.parse(String($md.ply.health.defaultAC)) }}</p>
            </div>
            <div class="col-3">
                <label class="text-body-secondary">Initiative</label>
                <p class="fw-bold fs-3 m-0">{{ $md.ply.parse(String($md.ply.stats.initiative)) }}</p>
            </div>
            <div class="col-3">
                <label class="text-body-secondary">Speed</label>
                <p class="fw-bold fs-3 m-0">{{ $md.ply.stats.speed }}</p>
            </div>
        </div>
        <!-- Other Info -->
        <div class="row py-1 mt-2 align-items-center">
            <span class="text-body-secondary col">Proficiency Bonus: </span><span class="col-3 text-start">{{
                $md.ply.stats.prof }}</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Passive Perception: </span><span class="col-3 text-start">{{
                $md.ply.parse(`${$md.ply.stats.passive_perception} + ${$md.ply.stats.passive_perception_mod ?
                    $md.ply.stats.passive_perception_mod : "0"}`)
                }}</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Gold: </span><span class="col-3 text-start">{{ $md.ply.inv.gold
                }} GP</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Hit Dice: </span><span class="col-3 text-start">{{
                $md.ply.health.hitdie }}</span>
        </div>
    </div>
    <div v-if="editMode">
        <EditPlayerBio />
    </div>
</template>

<script>
import mdButton from "@/components/ui/mdButton.vue";
import EditPlayerBio from "./EditPlayerBio.vue";

export default {
    name: "PlayerBio",
    data() {
        return {
            showPhotoForm: false,
            editMode: false,
            oldAvatar: ""
        };
    },
    components: {
        mdButton,
        EditPlayerBio
    },
    computed: {
        avatarUrlInput: {
            get() {
                const url = this.$md.ply.render.avatar || "";
                // If the URL is a base64 string, don't display it in the input
                if (url.startsWith("data:")) {
                    return "";
                }
                return url;
            },
            set(newUrl) {
                this.$md.ply.render.avatar = newUrl;
            }
        }
    },
    methods: {
        toggleEdit() {
            this.editMode = !this.editMode;
        },
        openPhotoForm() {
            this.oldAvatar = this.$md.ply.render.avatar || "";

            this.showPhotoForm = true;
        },
        changeAvatarUrl() {
            // The avatar URL has already been set via the file upload or text input
            // Close the form and clear the input if needed
            this.showPhotoForm = false;
            this.$md.savePlayer(); // Save the player data
        },
        cancelPhotoForm() {
            this.$md.ply.render.avatar = this.oldAvatar || "";

            this.showPhotoForm = false;
        },
        onAvatarFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Set the player's avatar to the base64 data URL
                    this.$md.ply.render.avatar = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
li {
    cursor: pointer;
}
</style>