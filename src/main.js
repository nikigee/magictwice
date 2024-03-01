import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/magicdice.scss"
import 'bootstrap-icons/font/bootstrap-icons.scss'
import 'bootstrap'

import { magicDice } from "./assets/md_magicdie"

const app = createApp(App);
app.use(router);

// Create a reactive object for $md
const md = reactive(magicDice);

// Expose $md to all components
app.config.globalProperties.$md = md;

app.mount('#app');
