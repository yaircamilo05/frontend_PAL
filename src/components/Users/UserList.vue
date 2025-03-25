<template>
  <div>
    <h2 class="text-xl font-semibold mb-6">Lista de Usuarios</h2>
    <div v-if="localUsers.length === 0" class="text-vue-gray-light">
      No hay usuarios disponibles.
    </div>
    <ul v-else class="space-y-6">
      <li
        v-for="user in localUsers"
        :key="user.id"
        class="flex items-center justify-between p-3.5 m-3 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 rounded-md border-2 border-gray-300 focus-within:border-vue-green focus-within:ring-2 focus-within:ring-vue-green"
      >
        <span class="text-sm font-medium pr-10">{{ user.username }}</span>
        <div class="flex items-center gap-4">
          <button
            @click="openEditModal(user)"
            class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
          >
            Editar
          </button>
          <button
            @click="handleDeleteUser(user.id)"
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
import { defineComponent, type PropType, ref, watch } from 'vue';
import type { User} from '@/models/User.model';
import Modal from '@/components/modal.vue';
import UserForm from './UserForm.vue';
import api, { deleteUser } from '@/services/api';
import { success, error, confirmation } from '../../composables/alerts.ts';

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
  emits: ['delete', 'edit', 'user-updated', 'user-deleted'],
  setup(props, { emit }) {
    const showEditModal = ref(false);
    const selectedUser = ref<any>(null);
    const editingUserId = ref<number | null>(null);
    const localUsers = ref<User[]>([...props.users]);
    
    const { showToast } = success();
    const { showError } = error();
    const { confirmDeletion } = confirmation();

    watch(() => props.users, (newUsers) => {
      localUsers.value = [...newUsers];
    }, { deep: true });

    const openEditModal = (user: User) => {      
      editingUserId.value = user.id;
    
      selectedUser.value = {
        id: user.id,
        username: user.username,
        password: '',
        roles: user.roles
      };
      
      showEditModal.value = true;
    };

    const handleDeleteUser = async (userId: number) => {
      const result = await confirmDeletion();

      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          localUsers.value = localUsers.value.filter(user => user.id !== userId);
          emit('user-deleted', userId);
          showToast('¡Usuario eliminado!', 'El usuario ha sido eliminado correctamente.');
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          
          showError('Error', 'No se pudo eliminar el usuario. Por favor, intenta de nuevo.');
        }
      }
    };

    const submitEditForm = async (updatedUser: any) => {
      console.log('=== Usuario actualizado ===');
      console.log('Datos enviados:', updatedUser);
      
      try {
        const userToUpdate = {
          ...updatedUser,
          id: editingUserId.value
        };
        const response = await api.put(`/users/update/${userToUpdate.id}`, userToUpdate);
        
        const index = localUsers.value.findIndex(user => user.id === userToUpdate.id);
        if (index !== -1) {
          localUsers.value[index] = {
            ...localUsers.value[index],
            ...response.data
          };
        }
        
        console.log('Respuesta de la API:', response.data);
        emit('user-updated', response.data);
        showToast('¡Usuario actualizado!', 'El usuario ha sido actualizado correctamente.');
        
        showEditModal.value = false;

      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        showError('Error', 'No se pudo actualizar el usuario. Por favor, intenta de nuevo.');
      }
    };

    return {
      showEditModal,
      selectedUser,
      localUsers,
      openEditModal,
      handleDeleteUser,
      submitEditForm
    };
  }
});
</script>