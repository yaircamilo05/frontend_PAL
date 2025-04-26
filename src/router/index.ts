import { createRouter, createWebHistory } from 'vue-router';
import CategoriesView from '../views/CategoriesView.vue';
import CoursesView from '../views/CoursesView.vue';
import UsersView from '../views/UsersView.vue';
import ContentView from '@/views/ContentView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
    },
    {
      path: '/content',
      name: 'content',
      component: ContentView,
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView, // Uso directo del componente importado
    },
    {
      
      path: '/login',
      name: 'login',
      component: () => import('@/components/Auth/login.vue'),
    }
  ],
});

export default router;