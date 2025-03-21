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
        class="flex items-center justify-between p-3.5 m-3 bg-[#212121] rounded-md"
      >
        <span>{{ user.username }}</span>
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
      <p class="text-gray-300">Aquí puedes agregar contenido personalizado para el modal.</p>
      <template #footer>
        <button 
          @click="showEditModal = false" 
          class="px-4 py-2 rounded-md cursor-pointer font-medium text-sm transition-all duration-200 bg-transparent text-gray-400 border border-gray-400 hover:text-white hover:border-white"
        >
          Cancelar
        </button>
        <button 
          @click="submitEditForm" 
          class="px-4 py-2 rounded-md cursor-pointer font-medium text-sm transition-all duration-200 bg-pink-500 text-white border border-pink-500 hover:bg-pink-600"
        >
          Guardar Cambios
        </button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import type { User } from '@/models/User.model';
import Modal from '@/components/modal.vue';

export default defineComponent({
  name: 'UserList',
  components: {
    Modal
  },
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    const showEditModal = ref(false);
    const selectedUser = ref<User | null>(null);

    const openEditModal = (user: User) => {
      selectedUser.value = { ...user }; // Clonar el usuario para evitar modificaciones directas
      showEditModal.value = true;
    };

    const submitEditForm = () => {
      // Este método se usa para el botón de guardar en el footer
      console.log('Guardar cambios para:', selectedUser.value);
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