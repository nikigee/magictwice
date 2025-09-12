import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import "./assets/magicdice.scss"
import 'bootstrap-icons/font/bootstrap-icons.scss'
import 'bootstrap'

import { useMagicDice } from '@/stores/mdStore'

const pinia = createPinia()
const app = createApp(App);
app.use(pinia);
app.use(router);

// Create a reactive object for $md
const magicStore = useMagicDice();
app.config.globalProperties.$md = magicStore.md; // TO DO: eventually get rid of this global

app.mount('#app');
