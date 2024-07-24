import './assets/main.css'
import { plugin as VueInputAutowidth } from 'vue-input-autowidth'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueInputAutowidth)
app.mount('#app')
