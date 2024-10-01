//@ts-nocheck
import './assets/main.css'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import * as GiIcons from 'oh-vue-icons/icons/gi'
import * as WiIcons from 'oh-vue-icons/icons/wi'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { PiniaPlugin, PiniaVuePlugin, createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import firebase from 'firebase/compat/app'
// Required for side-effects
import 'firebase/firestore'
import { auth } from './firebase/config'

import App from './App.vue'
import router from './router'

let app: any
const Gi = Object.values({ ...GiIcons })
const Wi = Object.values({ ...WiIcons })
addIcons(...Gi)
addIcons(...Wi)

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .use(createPinia().use(piniaPluginPersistedState as unknown as PiniaPlugin))
      .use(createBootstrap({ plugins: { modalController: true } }))
      .component('v-icon', OhVueIcon)
      .mount('#app')
  }
})
