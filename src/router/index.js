/* Vue Router configuration */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'
import SinglePlayerView from '@/views/SinglePlayer.vue'
import MultiPlayerView from '@/views/MultiPlayer.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/home'
  },
  { 
    path: '/home', 
    name: 'home',
    component: HomeView
  },  
  { 
    path: '/singlePlayer', 
    name: '/singlePlayer',
    component: SinglePlayerView
  },
  { 
    path: '/multiPlayer', 
    name: '/multiPlayer',
    component: MultiPlayerView
  },
  {
    path: '/:catchAll(.*)', 
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router