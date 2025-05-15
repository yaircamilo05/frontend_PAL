<template>
  <div>
    <h1>Bienvenido Estudiante</h1>
    <p>Aquí podrás ver tus cursos y contenido asignado.</p>
  </div>
  <nav>
        <RouterLink to="/student/courses">Mis Cursos</RouterLink>
        <RouterLink to="/student/profile">Mi Perfil</RouterLink>
      </nav>
</template>

<script lang="ts">



import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StudentHomeView',
});



</script>

<style scoped>
div {
  padding: 20px;
  text-align: center;
}
h1 {
  color: #4CAF50; /* Un color verde amigable */
  margin-bottom: 10px;
}
p {
  font-size: 1.1em;
  color: #555;
}
</style>
