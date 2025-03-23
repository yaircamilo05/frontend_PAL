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
        @edit="startEdit" 
        @delete="confirmDeleteUser" 
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

const startEdit = (user) => {
  // Implementar la lógica para comenzar a editar un usuario
  console.log('Editar usuario:', user);
  // Por ejemplo, podrías abrir un modal o cambiar a un modo de edición
};

const confirmDeleteUser = (userId) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede revertir',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUser(userId);
    }
  });
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
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el usuario.'
    });
  }
};

onMounted(fetchUsers);
</script>