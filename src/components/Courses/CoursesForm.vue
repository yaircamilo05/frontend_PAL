<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="flex flex-col">
      <label for="courseName" class="block text-sm font-medium">Nombre del Curso</label>
      <input v-model="formData.courseName" type="text" id="courseName"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese el nombre del curso" required />
    </div>

    <div class="flex flex-col pt-3">
      <label for="description" class="block text-sm font-medium">Descripción</label>
      <textarea v-model="formData.description" id="description" rows="4"
        class="mt-2 block w-full max-w-2xl rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        placeholder="Ingrese la descripción del curso" required></textarea>
    </div>

    <div class="flex flex-col pt-3">
      <label for="price" class="block text-sm font-medium">Precio</label>
      <div class="relative mt-2 max-w-2xl">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
        <input v-model="formData.price" type="number" id="price"
          class="block w-full h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3 pl-8"
          placeholder="0.00" min="0" step="0.01" required />
      </div>
    </div>

    <div class="flex flex-col pt-3">
      <label for="categories" class="block text-sm font-medium">Categorías</label>
      <select v-model="formData.categoryId" id="categories"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        required>
        <option value="">Seleccione una categoría</option>
        <option v-for="category in availableCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col pt-3">
      <label for="instructors" class="block text-sm font-medium">Instructores</label>
      <select v-model="formData.instructorId" id="instructors"
        class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
        required>
        <option value="">Seleccione un instructor</option>
        <option v-for="instructor in availableInstructors" :key="instructor.id" :value="instructor.id">
          {{ instructor.username }}
        </option>
      </select>
      <p v-if="instructorsLoading" class="text-sm text-gray-500 mt-1">Cargando instructores...</p>
      <p v-else-if="availableInstructors.length === 0" class="text-sm text-red-500 mt-1">No se encontraron instructores
        disponibles.</p>
    </div>

    <div class="flex justify-start pt-3">
      <button type="submit"
        class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:text-green-700 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
        :disabled="isSubmitting">
        {{ isSubmitting ? 'Creando...' : 'Crear Curso' }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/api';

// Definimos interfaces para nuestros tipos
interface Instructor {
  id: number;
  username: string;
  roles: Array<{ id: number, name: string }>;
  [key: string]: any; // Para permitir otras propiedades
}

interface Category {
  id: number;
  name: string;
  [key: string]: any; // Para permitir otras propiedades
}

interface FormData {
  courseName: string;
  description: string;
  price: string;
  categoryId: string | number;
  instructorId: string | number;
}

export default defineComponent({
  name: 'CourseForm',
  data() {
    return {
      formData: {
        courseName: '',
        description: '',
        price: '',
        categoryId: '',
        instructorId: ''
      } as FormData,
      availableCategories: [] as Category[],
      availableInstructors: [] as Instructor[],
      categoriesLoading: false,
      instructorsLoading: false,
      isSubmitting: false
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchInstructors();
  },
  methods: {
    async fetchCategories() {
      this.categoriesLoading = true;
      try {
        const response = await api.get('/categories/all');
        this.availableCategories = response.data;
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      } finally {
        this.categoriesLoading = false;
      }
    },
    async fetchInstructors() {
      this.instructorsLoading = true;
      try {
        // Obtenemos los instructores
        const response = await api.get('/users/by-role', {
          params: { role: 'INSTRUCTOR' }
        });

        console.log('Respuesta del servidor (instructores):', response.data);

        // Usar asignación segura con tipo explícito para evitar problemas de tipado
        if (response.data && Array.isArray(response.data)) {
          // Utilizamos una conversión explícita a nuestro tipo Instructor[]
          this.availableInstructors = response.data as Instructor[];
          console.log('Instructores procesados:', this.availableInstructors);
        } else {
          console.error('Formato de respuesta inesperado:', response.data);
          this.availableInstructors = [];
        }
      } catch (error) {
        console.error('Error al obtener instructores:', error);
      } finally {
        this.instructorsLoading = false;
      }
    },
    async handleSubmit() {
      this.isSubmitting = true;
      try {
        const courseData = {
          title: this.formData.courseName, // Cambiar de courseName a title
          description: this.formData.description,
          price: parseFloat(this.formData.price),
          categoryId: this.formData.categoryId,
          instructorId: this.formData.instructorId
        };

        console.log('Enviando datos del curso:', courseData);

        // También debes descomentar esta sección para realmente enviar los datos
        const response = await api.post('/courses/create', courseData);
        console.log('Curso creado con éxito:', response.data);
        this.$emit('submit', response.data);
        this.resetForm();
      } catch (error) {
        console.error('Error al crear el curso:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        courseName: '',
        description: '',
        price: '',
        categoryId: '',
        instructorId: ''
      };
    }
  }
});
</script>

<style scoped>
.close {
  cursor: pointer;
}
</style>