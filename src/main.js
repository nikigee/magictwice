import { createApp, inject } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import "./assets/magicdice.scss"

import { magicDice } from "./assets/md_magicdie"

const app = createApp(App);
app.use(router).mount('#app');

app.config.globalProperties.$md = magicDice;
