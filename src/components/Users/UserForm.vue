<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="flex flex-col">
      <label for="username" class="block text-sm font-medium">Nombre de Usuario</label>
      <input
        v-model="formData.username"
        type="text"
        id="username"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese el nombre de usuario"
        required
      />
    </div>
    <div class="flex flex-col pt-3">
      <label for="password" class="block text-sm font-medium">Contraseña</label>
      <input
        v-model="formData.password"
        type="password"
        id="password"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese la contraseña"
        :required="isCreateMode"
      />
    </div>
    <div class="flex flex-col pt-3">
      <label for="roles" class="block text-sm font-medium">Roles</label>
      <select
        v-model="selectedRoleId"
        id="roles"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
      >
        <option value="">Seleccione un rol</option>
        <option
          v-for="role in availableRoles"
          :key="role.id"
          :value="role.id"
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
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(role, index) in formData.roles"
          :key="index"
          class="px-3 py-1 rounded-md text-white tag"
          :class="{'bg-pink-500': !isCreateMode, 'bg-gray-500': isCreateMode}"
        >
          {{ role.name }}
          <span
            class="ml-2 cursor-pointer text-sm font-bold close"
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
import type { Role } from '@/models/Roles.model';

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
    }
  },
  emits: ['submit'],
  data() {
    return {
      formData: {
        username: this.user.username || '',
        password: this.user.password || '',
        roles: this.user.roles || []
      },
      roles: [] as Role[],
      selectedRoleId: '',
      availableRoles: [] as Role[],
    };
  },
  created() {
    console.log('UserForm created with user:', this.user);
  },
  mounted() {
    console.log('UserForm mounted - roles iniciales:', this.formData.roles);
    this.fetchRoles();
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await api.get('/roles/all');
        this.roles = response.data;
        console.log('Todos los roles disponibles:', this.roles);
        this.updateAvailableRoles();
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      }
    },
    updateAvailableRoles() {
      // Filtra los roles disponibles eliminando los que ya están seleccionados
      const selectedRoleIds = this.formData.roles.map(role => role.id);
      console.log('IDs de roles seleccionados:', selectedRoleIds);
      
      this.availableRoles = this.roles.filter(
        role => !selectedRoleIds.includes(role.id)
      );
      console.log('Roles disponibles después de filtrar:', this.availableRoles);
    },
    addRole() {
      if (!this.selectedRoleId) return;
      
      const selectedRole = this.roles.find(role => role.id === parseInt(this.selectedRoleId as string));
      if (selectedRole && !this.isRoleSelected(selectedRole)) {
        this.formData.roles.push(selectedRole);
        this.updateAvailableRoles();
        this.selectedRoleId = ''; // Reinicia el select
      }
    },
    isRoleSelected(role: Role): boolean {
      return this.formData.roles.some(r => r.id === role.id);
    },
    removeRole(index: number) {
      this.formData.roles.splice(index, 1); // Elimina el rol de la lista
      this.updateAvailableRoles(); // Actualiza los roles disponibles
    },
    handleSubmit() {
      // Preparar datos para el envío
      const userData = {
        username: this.formData.username,
        password: this.formData.password,
        // Extraer solo los nombres de los roles para enviar al backend
        roles: this.formData.roles.map(role => role.name)
      };
      
      console.log('Enviando datos de usuario:', userData);
      this.$emit('submit', userData);
    },
  },
});
</script>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  margin: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}
.close {
  cursor: pointer;
  margin-left: 0.5rem;
}
</style>