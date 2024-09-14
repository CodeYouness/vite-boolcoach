//commit di prova
import AppHome from '@/components/pages/guests/AppHome.vue';
import AppSearch from '@/components/pages/guests/AppSearch.vue';
import Error404 from '@/components/pages/guests/Error404.vue';
import ShowCoach from '@/components/pages/guests/ShowCoach.vue';
import ShowGame from '@/components/pages/guests/ShowGame.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppHome
    },
    {
      path: '/search',
      name: 'search',
      component: AppSearch
    },
    {
      path: '/404',
      name: '404-not-found',
      component: Error404
    },
    {
      path: '/coach/:id',
      name: 'coach-details',
      component: ShowCoach
    },
    {
      path: '/game/:id',
      name: 'game-details',
      component: ShowGame
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: Error404
    }
  ]
})

export { router };
