<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface UserInfo {
  id: number;
  username: string;
  roles: string[];
}

const userInfo = ref<UserInfo | null>(null);

onMounted(() => {
  const storedUserInfo = sessionStorage.getItem('userInfo');
  if (storedUserInfo) {
    try {
      userInfo.value = JSON.parse(storedUserInfo);
    } catch (e) {
      console.error("Error parsing userInfo from sessionStorage:", e);
      sessionStorage.removeItem('userInfo'); // Opcional: limpiar si está corrupto
    }
  }
});
</script>

<template>
  <main>
    <div>
      <h1 v-if="userInfo">Bienvenido {{ userInfo.roles.join(', ') }} {{ userInfo.username }}</h1>
      <h1 v-else>Bienvenido a la Plataforma</h1>
      <p v-if="userInfo && userInfo.roles.includes('ADMIN')">Este es el panel de Administrador.</p>
      <p v-else-if="userInfo && userInfo.roles.includes('INSTRUCTOR')">Aquí podrás gestionar tus cursos.</p>
      <p v-else>Por favor, inicia sesión para ver el contenido.</p>
    </div>
  </main>
</template>
