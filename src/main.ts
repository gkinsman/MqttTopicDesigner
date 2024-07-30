import './assets/main.css'
import { plugin as VueInputAutowidth } from 'vue-input-autowidth'

import { createRouter, createWebHashHistory } from 'vue-router'

import { createApp } from 'vue'
import App from './App.vue'
import TopicDesigner from '@/pages/TopicDesigner.vue'

const routes = [{ path: '/', component: TopicDesigner }]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.use(VueInputAutowidth)
app.mount('#app')
