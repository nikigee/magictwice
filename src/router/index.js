import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoadCharacter from '../views/LoadCharacter.vue'
import PlayerView from '../views/PlayerView.vue'
import NotesView from '../views/NotesView.vue'
import SpellListView from '../views/SpellListView.vue'
import SpellView from '../views/SpellView.vue'
import CreateCharacter from '../views/CreateCharacter.vue'
import SpellDebug from '../views/SpellDebug.vue'
import NotFound from '@/views/NotFound.vue'
import AboutView from '@/views/AboutView.vue'

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
        path: '/create',
        name: 'create',
        component: CreateCharacter
    },
    {
        path: '/about',
        name: "about",
        component: AboutView
    },
    {
        path: '/player/:id',
        name: 'player',
        component: PlayerView
    },
    {
        path: '/player/:id/notes',
        name: 'notebook',
        component: NotesView
    },
    {
        path: '/player/:id/spells',
        name: 'spellbook',
        component: SpellListView
    },
    {
        path: '/player/:id/spell/:spell',
        name: 'spell',
        component: SpellView
    },
    {
        path: '/player/:id/spells/debug',
        name: 'spell debug',
        component: SpellDebug
    },
    {
        path: '/:catchAll(.*)',
        name: "404 not found",
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    }
})

export default router
