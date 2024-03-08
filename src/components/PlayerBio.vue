<template>
    <div v-if="!editMode">
        <!-- Edit Avatar -->
        <div v-if="showPhotoForm" class="my-3 d-flex align-items-center">
            <input type="text" v-model="newAvatarUrl" class="form-control" placeholder="New photo URL">
            <button @click="changeAvatarUrl" class="py-1 px-1 m-0 ms-1 btn btn-primary"><i
                    class="bi bi-check"></i></button>
        </div>
        <!-- Name -->
        <div class="d-flex my-1 align-items-center justify-content-between">
            <h1 class="h2 py-1 m-0">{{ $md.ply.name }}</h1>
            <!-- Dropdown Options -->
            <div class="dropdown dropcenter">
                <button class="btn fs-4 p-0 px-2 text-muted" data-bs-toggle="dropdown" aria-expanded="false"><i
                        class="bi bi-three-dots"></i></button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item" @click="showPhotoForm = true">
                        Choose Photo
                    </li>
                    <li class="dropdown-item" @click="editMode = true">
                        Edit Information
                    </li>
                    <li class="dropdown-item" @click="$md.ply.saveToFile()">
                        Export (.json)
                    </li>
                </ul>
            </div>
        </div>
        <!-- Important Info -->
        <p class="text-body-secondary mb-0"> {{ $md.ply.player_class.name }} - Level {{ $md.ply.lvl }}</p>
        <p><span class="text-body-secondary">XP: </span>{{ $md.ply.exp }}</p>
        <div class="row justify-content-between mt-2">
            <div class="col-3">
                <label class="text-body-secondary">AC</label>
                <p class="fw-bold fs-3 m-0">{{ $md.ply.health.defaultAC }}</p>
            </div>
            <div class="col-3">
                <label class="text-body-secondary">Initiative</label>
                <p class="fw-bold fs-3 m-0">{{ $md.ply.stats.initiative }}</p>
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
        $md.ply.stats.passive_perception }}</span>
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
        <div class="text-center mt-3">
            <mdButton>Save</mdButton>
            <mdButton @click="editMode = false">Cancel</mdButton>
        </div>
    </div>
</template>

<script>
import mdButton from "@/components/ui/mdButton.vue"

export default {
    name: "PlayerBio",
    data() {
        return {
            showPhotoForm: false,
            newAvatarUrl: '',
            editMode: false
        };
    },
    components: {
        mdButton: mdButton
    },
    methods: {
        toggleEdit() {
            this.editMode = this.editMode ? false : true;
        },
        changeAvatarUrl() {
            // Update the avatar URL with the new value
            this.$md.ply.render.avatar = this.newAvatarUrl;

            // Close the form after saving
            this.showPhotoForm = false;
            this.newAvatarUrl = '';

            this.$md.savePlayer(); // save
        }
    }
}
</script>

<style lang="scss" scoped></style>