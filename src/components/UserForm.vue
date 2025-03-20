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
import type { UserCreate } from '@/models/User.model';
import { defineComponent, type PropType} from 'vue';

export default defineComponent({
  name: 'UserForm',
  props: {
    user: {
      type: Object as PropType<UserCreate>,
      default: () => ({ username: '', password: '' }),
    },
    isCreateMode: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit'],
  data() {
    return {
      formData: { ...this.user },
      options: ['Opción 1', 'Opción 2', 'Opción 3'], // Opciones disponibles
      selectedOption: '', // Opción seleccionada en el select
      selectedOptions: [] as string[], // Lista de opciones seleccionadas
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData);
    },
    addOptionToList() {
      if (this.selectedOption && !this.selectedOptions.includes(this.selectedOption)) {
        this.selectedOptions.push(this.selectedOption);
        this.selectedOption = ''; // Reinicia el select
      }
    },
  },
});
</script>