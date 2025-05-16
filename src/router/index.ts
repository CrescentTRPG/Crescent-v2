import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LandingView from '../views/LandingView.vue'
import CharacterView from '@/views/CharacterView.vue'
import AdventureView from '@/views/AdventureView.vue'
import AdventureCharacterView from '@/views/AdventureCharacterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/character',
      name: 'character',
      component: CharacterView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/adventure',
      name: 'adventure',
      component: AdventureView
    },
    {
      path: '/adventure/character',
      name: 'adventure character',
      component: AdventureCharacterView
    }
  ]
})

export default router
