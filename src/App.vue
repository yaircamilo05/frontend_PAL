<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const route = useRoute()
const userRole = ref<string | null>(null)

const updateUserRole = () => {
  userRole.value = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo')!).roles[0]
    : null
  console.log('User role updated:', userRole.value)
}

onMounted(() => {
  updateUserRole()
  window.addEventListener('storage', updateUserRole)
})

watch(
  () => route.path,
  () => {
    updateUserRole()
  }
)
</script>

<template>  <header v-if="route.path !== '/login'">
    <img alt="Vue logo" class="logo" src="@/assets/pal2.svg" width="125" height="125" />
    <div class="wrapper">
      <h1 class="text-2xl font-bold">Sistema PAL</h1>
      <nav v-if="userRole === 'ADMIN'" aria-label="Admin Navigation">
        <RouterLink to="/admin/categories">Categorías</RouterLink>
        <RouterLink to="/admin/content">Contenido</RouterLink>
        <RouterLink to="/admin/courses">Cursos</RouterLink>
        <RouterLink to="/admin/users">Usuarios</RouterLink>
      </nav>
      <nav v-if="userRole === 'student'" aria-label="Student Navigation">
        <RouterLink to="/student/courses">Explorar Cursos</RouterLink>
        <RouterLink to="/student/profile">Mi Perfil</RouterLink>
        <RouterLink to="/student/my-enrollments">Mis Cursos</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  .logo {
    margin: 0 2rem 0 0;
  }
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>