import { createRouter, createWebHistory } from 'vue-router';
import CategoriesView from '../views/CategoriesView.vue';
import CoursesView from '../views/CoursesView.vue';
import UsersView from '../views/UsersView.vue';
import ContentView from '@/views/ContentView.vue';
import HomeView from '../views/HomeView.vue';
import StudentEnrollmentView from '@/views/StudentEnrollmentView.vue';
import CoursesStudentView from '@/views/CoursesStudentView.vue';
import CourseContentView from '@/views/CourseContentView.vue';
import ExamView from '@/views/ExamView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/categories',
      name: 'categories',
      component: CategoriesView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/content',
      name: 'content',
      component: ContentView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/courses',
      name: 'courses',
      component: CoursesView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/Auth/login.vue'),
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: HomeView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/instructor/courses',
      name: 'instructor-courses',
      component: HomeView,
    },
    {
      path: '/student/home',
      name: 'student-home',
      component: HomeView,
    },

    {
      path: '/student/courses',
      name: 'student-courses',
      component: CoursesStudentView,
    },    {
      path: '/student/my-enrollments',
      name: 'student-my-enrollments',
      component: StudentEnrollmentView
    },    {
      path: '/student/course/:id',
      name: 'student-course-content',
      component: CourseContentView
    },
    {
      path: '/student/exam/:examId/:examName',
      name: 'student-exam',
      component: ExamView
    }
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const userInfoString = sessionStorage.getItem('userInfo');
  let userRoles: string[] = [];

  if (userInfoString) {
    try {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo && Array.isArray(userInfo.roles)) {
        userRoles = userInfo.roles;
      }
    } catch (e) {
      console.error("Error parsing userInfo from sessionStorage:", e);
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('jwt');
    }
  }

  const isAuthenticated = !!sessionStorage.getItem('jwt');

  if (requiresAdmin) {
    if (isAuthenticated && userRoles.includes('ADMIN')) {
      next();
    } else if (isAuthenticated) {
      alert('No tienes permisos de administrador para acceder a esta página.');
      next(from.path);
    } else {
      alert('Debes iniciar sesión para acceder a esta página.');
      next('/login');
    }
  } else {
    next();
  }
});

export default router;