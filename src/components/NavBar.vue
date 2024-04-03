<template>
    <div class="mb-2">
        <div class="container">
            <header class="d-flex flex-wrap justify-content-center py-3">
                <router-link to="/"
                    class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                    <img src="../assets/navlogo.png" style="height: 35px;">
                </router-link>

                <ul class="nav nav-pills" v-if="$md.ply">
                    <li class="nav-item"><router-link class="nav-link"
                            :to="'/player/' + $md.ply.id">Dashboard</router-link></li>
                    <li class="nav-item"><router-link class="nav-link"
                            :to="'/player/' + $md.ply.id + '/notes'">Notebook</router-link></li>
                    <li class="nav-item"><router-link class="nav-link"
                            :to="'/player/' + $md.ply.id + '/spells'">Spellbook</router-link></li>
                </ul>
            </header>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBar'
}
</script>

<style lang="scss" scoped></style>