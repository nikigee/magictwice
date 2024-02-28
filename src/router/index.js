import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoadCharacter from '../views/LoadCharacter.vue'
import PlayerView from '../views/PlayerView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/load',
        name: 'load',
        component: LoadCharacter
    },
    {
        path: '/player/:id',
        component: PlayerView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
