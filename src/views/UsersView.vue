<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-10">Gestión de Usuarios</h1>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Crear Nuevo Usuario</h2>
      <UserForm :isCreateMode="true" @submit="createNewUser" />
    </div>

    <div class="contenedor_interno">
      <UserList 
        :users="users" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api';
import UserForm from '@/components/Users/UserForm.vue';
import UserList from '@/components/Users/UserList.vue';

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await api.get('/users/all');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los usuarios.' });
  }
};

const createNewUser = async (userData) => {
  try {
    const response = await api.post('/users/create', userData);
    users.value.push(response.data);
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Usuario creado correctamente.', timer: 1500, showConfirmButton: false });
  } catch (error) {
    console.error('Error creating user:', error);
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el usuario.' });
    throw error;
  }
};



const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    users.value = users.value.filter(user => user.id !== userId);
    Swal.fire({
      title: '¡Eliminado!',
      text: 'El usuario ha sido eliminado.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el usuario.'
    });
  }
};

onMounted(fetchUsers);
</script>