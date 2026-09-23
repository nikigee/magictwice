<template>
    <div v-if="!editMode">
        <!-- Edit Avatar -->
        <div class="my-3" v-if="showPhotoForm">
            <!-- File Upload for Avatar -->
            <input 
                type="file" 
                @change="onAvatarFileChange" 
                accept="image/*" 
                class="form-control form-control-sm mb-1" 
                :disabled="isUploading"
            />
            <!-- <input 
                type="text" 
                v-model="avatarUrlInput" 
                class="form-control form-control-sm" 
                placeholder="image url" 
                :disabled="isUploading"
            /> -->

            <!-- Upload progress & feedback -->
            <div v-if="isUploading" class="small text-primary mt-1">
                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Uploading image...
            </div>
            <div v-if="uploadError" class="small text-danger mt-1">
                {{ uploadError }}
            </div>

            <div class="mt-2 text-center text-lg-start">
                <mdButton class="ms-0" @click="changeAvatarUrl" :disabled="isUploading">
                    {{ isUploading ? 'Uploading...' : 'Set' }}
                </mdButton>
                <mdButton class="me-0 btn-outline-secondary" @click="cancelPhotoForm" :disabled="isUploading">
                    Cancel
                </mdButton>
            </div>
        </div>

        <!-- Name -->
        <div class="d-flex my-1 align-items-center justify-content-between">
            <h1 class="h2 py-1 m-0">{{ $md.ply.name }}</h1>
            <!-- Dropdown Options -->
            <div class="dropdown dropcenter">
                <button class="btn fs-4 p-0 px-2 text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots"></i>
                </button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item" @click="openPhotoForm">
                        <i class="bi bi-image me-1"></i> Upload Avatar
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
        <p class="text-body-secondary mb-0"> {{ $md.ply.player_class.name }} - Level {{$md.ply.lvl }}</p>
        <div>
            <div v-if="$md.ply.exp !== 0"><span class="text-body-secondary">XP: </span>{{ $md.ply.exp }}</div>
        </div>

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
            <span class="text-body-secondary col">Proficiency Bonus: </span>
            <span class="col-3 text-start">{{ $md.ply.stats.prof }}</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Passive Perception: </span>
            <span class="col-3 text-start">{{
                $md.ply.parse(`${$md.ply.stats.passive_perception} + ${$md.ply.stats.passive_perception_mod ?
                    $md.ply.stats.passive_perception_mod : "0"}`)
            }}</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Gold: </span>
            <span class="col-3 text-start">{{ $md.ply.inv.gold }} GP</span>
        </div>
        <div class="row py-1 align-items-center">
            <span class="text-body-secondary col">Hit Dice: </span>
            <span class="col-3 text-start">{{ $md.ply.health.hitdie }}</span>
        </div>
    </div>

    <div v-if="editMode">
        <EditPlayerBio />
    </div>
</template>

<script>
import mdButton from "@/components/ui/mdButton.vue";
import EditPlayerBio from "./EditPlayerBio.vue";
import { useAPIStore } from "@/stores/apiStore.js";
import { useAlertStore } from "@/stores/alertStore.js";

export default {
    name: "PlayerBio",
    data() {
        return {
            showPhotoForm: false,
            editMode: false,
            oldAvatar: "",
            isUploading: false,
            uploadError: ""
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
                // If it's a legacy base64 string, don't fill the text box
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
            this.uploadError = "";
            this.showPhotoForm = true;
        },
        changeAvatarUrl() {
            if (this.isUploading) return;
            this.showPhotoForm = false;
            this.$md.savePlayer();
        },
        cancelPhotoForm() {
            if (this.isUploading) return;
            this.$md.ply.render.avatar = this.oldAvatar || "";
            this.uploadError = "";
            this.showPhotoForm = false;
        },
        async onAvatarFileChange(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Optional client-side size check (e.g. max 5MB)
            const MAX_SIZE = 15 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                this.uploadError = "File size exceeds 15MB limit.";
                e.target.value = "";
                return;
            }

            this.isUploading = true;
            this.uploadError = "";

            try {
                const apiStore = useAPIStore();
                const { imageUrl } = await apiStore.uploadImage(file);
                
                // Set the avatar URL to the cached CDN proxy route
                this.$md.ply.render.avatar = imageUrl;

                useAlertStore().create("Avatar uploaded successfully!", "success");
            } catch (err) {
                console.error("Avatar upload failed:", err);
                this.uploadError = err.message || "Failed to upload image. Please try again.";
            } finally {
                this.isUploading = false;
                // Clear the input so selecting the same file again triggers change
                e.target.value = "";
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