<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-10">Gestión de Usuarios</h1>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Crear Nuevo Usuario</h2>
      <UserForm :isCreateMode="true" @submit="createNewUser" />
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
import UserForm from '@/components/UserForm.vue';

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

const createNewUser = async (userData) => {
  try {
    const response = await api.post('/users/create', userData);
    users.value.push(response.data);
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Usuario creado correctamente.', timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el usuario.' });
  }
};

onMounted(fetchUsers);
</script>