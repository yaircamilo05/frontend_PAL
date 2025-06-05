<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'
import { user, userRole, isAuthenticated, setUserFromSession } from './composables/useAuth'

const route = useRoute()

// Cargar usuario desde sessionStorage al inicio
onMounted(() => {
  setUserFromSession()
})

// Volver a cargar si cambia la ruta (opcional, útil tras redirección desde login)
watch(() => route.path, () => {
  if (!user.value) setUserFromSession()
})
</script>

<template>
  <header v-if="route.path !== '/login' && isAuthenticated">
    <img alt="Vue logo" class="logo" src="@/assets/pal2.svg" width="125" height="125" />
    <div class="wrapper">
      <h1 class="text-2xl font-bold">Sistema PAL</h1>

      <nav v-if="userRole === 'ADMIN'">
        <RouterLink to="/admin/categories">Categorías</RouterLink>
        <RouterLink to="/admin/content">Contenido</RouterLink>
        <RouterLink to="/admin/courses">Cursos</RouterLink>
        <RouterLink to="/admin/users">Usuarios</RouterLink>
        <RouterLink to="/admin/reportes-progreso">Reportes</RouterLink>
      </nav>

      <nav v-else-if="userRole === 'INSTRUCTOR'">
        <p style="color: #666;">Menú de Instructor</p>
      </nav>

      <nav v-else-if="userRole === 'student'">
        <RouterLink to="/student/courses">Explorar Cursos</RouterLink>
        <RouterLink to="/student/profile">Mi Perfil</RouterLink>
        <RouterLink to="/student/my-enrollments">Mis Cursos</RouterLink>
        <RouterLink to="/student/certificates">Mis Certificados</RouterLink>
      </nav>

      <div v-else style="background: #ffebee; padding: 10px; margin: 10px 0; border-radius: 5px; color: #c62828;">
        <p><strong>⚠️ No se muestra ningún menú</strong></p>
        <p>userRole: "<strong>{{ userRole }}</strong>"</p>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/* [Estilos iguales que antes] */
</style>
