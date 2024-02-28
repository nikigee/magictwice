import { createApp, inject } from 'vue'
import App from './App.vue'
import router from './router'

import "./assets/magicdice.scss"
import "bootstrap"

import { magicDice } from "./assets/md_magicdie"

const app = createApp(App);
app.use(router).mount('#app');

app.config.globalProperties.$md = magicDice;
