import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoadCharacter from '../views/LoadCharacter.vue'
import PlayerView from '../views/PlayerView.vue'
import NotesView from '../views/NotesView.vue'
import SpellListView from '../views/SpellListView.vue'
import SpellView from '../views/SpellView.vue'

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
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
