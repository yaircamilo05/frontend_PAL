<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Título -->
    <div class="flex flex-col">
      <label for="courseName" class="block text-sm font-medium">Nombre del Curso</label>
      <input v-model="formData.title" type="text" id="courseName"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese el nombre del curso" required />
    </div>

    <!-- Descripción -->
    <div class="flex flex-col pt-3">
      <label for="description" class="block text-sm font-medium">Descripción</label>
      <textarea v-model="formData.description" id="description" rows="4"
        class="mt-2 block w-full max-w-2xl rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese la descripción del curso" required></textarea>
    </div>

    <!-- Precio -->
    <div class="flex flex-col pt-3">
      <label for="price" class="block text-sm font-medium">Precio</label>
      <div class="relative mt-2 max-w-2xl">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
        <input v-model="formData.price" type="number" id="price"
          class="block w-full h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3 pl-8"
          placeholder="0.00" min="0" step="0.01" required />
      </div>
    </div>

    <!-- Categoría -->
    <div class="flex flex-col pt-3">
      <label for="categories" class="block text-sm font-medium">Categorías</label>
      <select v-model="formData.categoryId" id="categories"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        required>
        <option value="">Seleccione una categoría</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Instructor -->
    <div class="flex flex-col pt-3">
      <label for="instructors" class="block text-sm font-medium">Instructores</label>
      <select v-model="formData.instructorId" id="instructors"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        required>
        <option value="">Seleccione un instructor</option>
        <option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">
          {{ instructor.username }}
        </option>
      </select>
      <p v-if="instructors.length === 0" class="text-sm text-red-500 mt-1">No se encontraron instructores disponibles.</p>
    </div>

    <!-- Botón -->
    <div class="flex justify-start pt-3">
      <button type="submit"
        class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:border-green-300 hover:text-green-300 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
        :disabled="isSubmitting">
        {{ isCreateMode ? (isSubmitting ? 'Creando...' : 'Crear Curso') : (isSubmitting ? 'Guardando...' : 'Guardar Cambios') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import api from '@/services/api';
import type { Course } from '@/models/Course.model';
import type { Instructor } from '@/models/User.model';
import type { Category } from '@/models/Category.model';

export default defineComponent({
  name: 'CourseForm',
  props: {
    course: {
      type: Object as PropType<Course>,
      default: () => ({
        id: 0,
        title: '',
        description: '',
        price: 0,
        category: { id: 0, name: '' },
        instructor: { id: 0, username: '' }
      }),
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
        title: this.course.title || '',
        description: this.course.description || '',
        price: this.course.price || 0,
        categoryId: this.course.category?.id || 0,
        instructorId: this.course.instructor?.id || 0
      },
      instructors: [] as Instructor[],
      categories: [] as Category[],
      isSubmitting: false
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchInstructors();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await api.get('/categories/all');
        this.categories = response.data;
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    },
    async fetchInstructors() {
      try {
        const response = await api.get('/users/by-role', {
          params: { role: 'INSTRUCTOR' }
        });
        this.instructors = response.data;
      } catch (error) {
        console.error('Error al obtener instructores:', error);
      }
    },
    async handleSubmit() {
      this.isSubmitting = true;
      // Solo emitimos los datos al padre y dejamos que él llame a la API
      this.$emit('submit', { ...this.formData });
      this.isSubmitting = false;
    },
  }
}
);
</script>
