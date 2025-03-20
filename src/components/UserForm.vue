<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="flex flex-col">
      <label for="username" class="block text-sm font-medium">Nombre de Usuario</label>
      <input
        v-model="formData.username"
        type="text"
        id="username"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese el nombre de usuario"
        required
      />
    </div>
    <div class="flex flex-col">
      <label for="password" class="block text-sm font-medium">Contraseña</label>
      <input
        v-model="formData.password"
        type="password"
        id="password"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese la contraseña"
        :required="isCreateMode"
      />
    </div>
    <div class="flex flex-col">
      <label for="roles" class="block text-sm font-medium">Roles</label>
      <select
        v-model="selectedRole"
        id="roles"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
      >
        <option
          v-for="role in availableRoles"
          :key="role.id"
          :value="role.name"
        >
          {{ role.name }}
        </option>
      </select>
      <button
        type="button"
        @click="addRole"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-700"
      >
        Agregar Rol
      </button>
    </div>
    <div class="flex flex-col mt-4">
      <h3 class="text-lg font-semibold">Roles Seleccionados:</h3>
      <div class="flex flex-wrap">
        <div
          v-for="(role, index) in formData.roles"
          :key="index"
          class="tag"
        >
          {{ role }}
          <span
            class="close"
            @click="removeRole(index)"
          >
            &times;
          </span>
        </div>
      </div>
    </div>
    <div class="flex justify-start pt-3">
      <button
        type="submit"
        class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:text-green-700 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
      >
        {{ isCreateMode ? 'Crear Usuario' : 'Guardar Cambios' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import api from '@/services/api';
import type { UserCreate } from '@/models/User.model';

export default defineComponent({
  name: 'UserForm',
  props: {
    user: {
      type: Object as PropType<UserCreate>,
      default: () => ({ username: '', password: '', roles: [] }),
    },
    isCreateMode: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit'],
  data() {
    return {
      formData: { ...this.user, roles: [] as string[] }, // Almacena solo los nombres de los roles
      roles: [] as { id: number; name: string }[], // Lista de roles obtenidos de la API
      selectedRole: '', // Rol seleccionado en el select
      availableRoles: [] as { id: number; name: string }[], // Roles disponibles para el select
    };
  },
  mounted() {
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await api.get('/roles/all'); // Llama a la API para obtener los roles
        this.roles = response.data; // Asigna los roles obtenidos a la lista
        this.updateAvailableRoles();
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      }
    },
    updateAvailableRoles() {
      // Filtra los roles disponibles eliminando los que ya están seleccionados
      this.availableRoles = this.roles.filter(
        (role) => !this.formData.roles.includes(role.name)
      );
    },
    addRole() {
      if (this.selectedRole && !this.formData.roles.includes(this.selectedRole)) {
        this.formData.roles.push(this.selectedRole); // Agrega solo el nombre del rol
        this.updateAvailableRoles(); // Actualiza los roles disponibles
        this.selectedRole = ''; // Reinicia el select
      }
    },
    removeRole(index: number) {
      this.formData.roles.splice(index, 1); // Elimina el rol de la lista
      this.updateAvailableRoles(); // Actualiza los roles disponibles
    },
    handleSubmit() {
      this.$emit('submit', this.formData); // Envía solo los nombres de los roles
    },
  },
});
</script>
