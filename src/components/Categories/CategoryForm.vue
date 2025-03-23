/* CategoryForm.vue */
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="flex flex-col">
      <label for="categoryName" class="block text-sm font-medium">Nombre de la Categoría</label>
      <input
        v-model="formData.name"
        type="text"
        id="categoryName"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese el nombre de la categoría"
        required
      />
    </div>
    <div class="flex justify-start pt-3">
      <button
        type="submit"
        class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:text-green-700 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
      >
        {{ isCreateMode ? 'Crear Categoría' : 'Guardar Cambios' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive } from 'vue';

defineProps({
  isCreateMode: Boolean,
  category: Object,
});

const emit = defineEmits(['submit']);
const formData = reactive({ name: '' });

function handleSubmit() {
  emit('submit', { ...formData });
}
</script>