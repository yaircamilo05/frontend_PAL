<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">Lista de Usuarios</h2>
    <div v-if="users.length === 0" class="text-vue-gray-light">
      No hay usuarios disponibles.
    </div>
    <ul v-else class="space-y-6">
      <li
        v-for="user in users"
        :key="user.id"
        class="flex items-center justify-between p-3.5 m-3 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-md border-2 border-gray-300 focus-within:border-vue-green focus-within:ring-2 focus-within:ring-vue-green"
      >
        <span class="text-sm font-medium">{{ user.username }}</span>
        <div class="flex items-center gap-4">
          <button
            @click="openEditModal(user)"
            class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
          >
            Editar
          </button>
          <button
            @click="$emit('delete', user.id)"
            class="inline-flex items-center justify-center px-4 py-2 text-red-500 hover:text-red-700 border-2 border-red-500 rounded-md"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>

    <!-- Modal -->
    <Modal v-model:isOpen="showEditModal" title="Editar Usuario">
      <UserForm 
        v-if="selectedUser" 
        :user="selectedUser" 
        :isCreateMode="false" 
        @submit="submitEditForm" 
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import type { User, UserCreate } from '@/models/User.model';
import Modal from '@/components/modal.vue';
import UserForm from './UserForm.vue';

export default defineComponent({
  name: 'UserList',
  components: {
    Modal,
    UserForm
  },
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true
    }
  },
  emits: ['delete', 'edit'],
  setup(props, { emit }) {
    const showEditModal = ref(false);
    const selectedUser = ref<UserCreate | null>(null);

    const openEditModal = (user: User) => {
      // Mapear el usuario con contraseña vacía y mantener el id
      selectedUser.value = {
        username: user.username,
        password: '', // Contraseña vacía
        roles: user.roles
      };
      showEditModal.value = true;
    };

    const submitEditForm = (updatedUser: UserCreate) => {
      emit('edit', updatedUser); // Emitir el usuario actualizado al componente padre
      showEditModal.value = false;
    };

    return {
      showEditModal,
      selectedUser,
      openEditModal,
      submitEditForm
    };
  }
});
</script>