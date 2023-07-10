// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css'

// Importez le plugin de persistance
import { persistStatePlugin } from './store/persistStatePlugin';

const app = createApp(App);

// Créez et configurez Pinia
const pinia = createPinia();
pinia.use(persistStatePlugin);
app.use(pinia);

app.mount('#app');
