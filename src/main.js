import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DataService from './services/DataService'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

const app = createApp(App)

// Provide data service to all components
app.provide('dataService', DataService)

app.use(router)
app.mount('#app')