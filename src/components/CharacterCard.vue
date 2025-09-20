<template>
    <div class="card overflow-hidden text-center border-0 shadow noavatar">
        <div class="noavatar-blur"
            :style="{ 'background-image': 'url(' + char.renderData.avatar + ')', backgroundPosition: 'center top', backgroundSize: 'cover' }">
            <div style="height: 10rem;" class="">
            </div>
            <div class="card-body p-2 px-3 d-flex justify-content-between align-items-center card-bg">
                <div class="text-start">
                    <router-link class="text-decoration-none" :to="'/player/' + link">
                        <h4 class="card-title fs-5 m-0">{{ char.name }}</h4>
                    </router-link>
                    <p class="card-text text-muted mb-0" style="font-size: 14px;">Level
                        {{ char.lvl }} {{ char.classData.name }}</p>
                </div>
                <div class="dropdown dropcenter">
                    <button class="btn p-0" data-bs-toggle="dropdown" aria-expanded="false"><i
                            class="bi bi-three-dots"></i></button>
                    <ul class="dropdown-menu">
                        <li><router-link class="dropdown-item" to="/load" @click="handleDelete">Remove
                                Character</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CharacterCard',
    props: {
        char: Object,
        link: String
    },
    methods: {
        handleDelete() {
            console.log(this.link, this.$parent.characters);
            delete this.$parent.characters[this.link]; 
            this.$md.Load.deleteCharacter(this.link);
        }
    }
}
</script>

<style lang="scss" scoped>
.card-bg {
    background-color: rgba(8, 8, 10, 0.90);
}
</style>