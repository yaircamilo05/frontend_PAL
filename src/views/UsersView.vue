<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-10">Gestión de Usuarios</h1>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Crear Nuevo Usuario</h2>
      <form @submit.prevent="createNewUser" class="space-y-6">
        <div class="flex flex-col">
          <label for="username" class="block text-sm font-medium">Nombre de Usuario</label>
          <input
            v-model="newUser.username"
            type="text"
            id="username"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            placeholder="Ingrese el nombre de usuario"
            required
          />
        </div>
        <div class="flex flex-col">
          <label for="password" class="block text-sm font-medium">Contraseña</label>
          <input
            v-model="newUser.password"
            type="password"
            id="password"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            placeholder="Ingrese la contraseña"
            required
          />
        </div>
        <div class="flex justify-start pt-3">
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:text-green-700 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
          >
            Crear usuario
          </button>
        </div>
      </form>
    </div>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Lista de Usuarios</h2>
      <div v-if="users.length === 0" class="text-vue-gray-light">
        No hay usuarios disponibles.
      </div>
      <ul v-else class="space-y-6">
        <li
          v-for="user in users"
          :key="user.id"
          class="flex items-center justify-between p-3.5 m-3 bg-[#212121] rounded-md"
        >
          <span>{{ user.username }}</span>
          <div class="flex items-center gap-4">
            <button
              @click="startEdit(user)"
              class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
            >
              Editar
            </button>
            <button
              @click="confirmDeleteUser(user.id)"
              class="inline-flex items-center justify-center px-4 py-2 text-red-500 hover:text-red-700 border-2 border-red-500 rounded-md"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api';

const users = ref([]);
const newUser = ref({ username: '', password: '' });

const fetchUsers = async () => {
  try {
    const response = await api.get('/users/all');
    users.value = response.data;
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los usuarios.' });
  }
};

const createNewUser = async () => {
  try {
    const response = await api.post('/users/create', newUser.value);
    users.value.push(response.data);
    newUser.value = { username: '', password: '' };
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Usuario creado correctamente.', timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el usuario.' });
  }
};

const startEdit = async (user) => {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Usuario',
    html:
      '<input id="swal-username" class="swal2-input" placeholder="Nombre de usuario" value="' + user.username + '">' +
      '<input id="swal-password" class="swal2-input" type="password" placeholder="Contraseña (dejar en blanco para mantener la actual)">',
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Guardar',
    confirmButtonColor: '#42b983',
    cancelButtonColor: '#34495e',
    preConfirm: () => {
      return {
        username: document.getElementById('swal-username').value,
        password: document.getElementById('swal-password').value
      }
    }
  });

  if (formValues) {
    try {
      const response = await api.put(`/users/update/${user.id}`, formValues);
      const index = users.value.findIndex((u) => u.id === user.id);
      users.value[index] = response.data;
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Usuario actualizado correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario.',
      });
    }
  }
};

const confirmDeleteUser = async (id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#34495e',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/users/delete/${id}`);
      users.value = users.value.filter(user => user.id !== id);
      Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'Usuario eliminado correctamente.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el usuario.' });
    }
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
input {
  background-color: #2c3e50;
  color: #ecf0f1;
}
input::placeholder {
  color: #bdc3c7;
}
button:hover {
  opacity: 0.9;
}
</style>
