<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-10">Gestión de Categorías</h1>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Crear Nueva Categoría</h2>
      <form @submit.prevent="createNewCategory" class="space-y-6">
        <div class="flex flex-col">
          <label for="name" class="block text-sm font-medium">Nombre</label>
          <input
            v-model="newCategory.name"
            type="text"
            id="name"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            placeholder="Ingrese el nombre de la categoría"
            required
          />
        </div>
        <div class="flex justify-start pt-3">
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:text-green-700 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
          >
            Crear categoría
          </button>
        </div>
      </form>
    </div>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Lista de Categorías</h2>
      <div v-if="categories.length === 0" class="text-vue-gray-light">
        No hay categorías disponibles.
      </div>
      <ul v-else class="space-y-6">
        <li
          v-for="category in categories"
          :key="category.id"
          class="flex items-center justify-between p-3.5 m-3 bg-[#212121] rounded-md"
        >
          <span>{{ category.name }}</span>
          <div class="flex items-center gap-4">
            <button
              @click="startEdit(category)"
              class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
            >
              Editar
            </button>
            <button
              @click="confirmDelete(category.id)"
              class="inline-flex items-center justify-center px-4 py-2 text-red-500 hover:text-red-700 border-2 border-red-500 rounded-md"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getCategories, createCategory, deleteCategory } from '@/services/api';
import api from '@/services/api';

interface CategoryDTO {
  id: number;
  name: string;
}

interface CreateCategoryDTO {
  name: string;
}

const categories = ref<CategoryDTO[]>([]);
const newCategory = ref<CreateCategoryDTO>({ name: '' });
const editCategory = ref<CategoryDTO | null>(null);

onMounted(async () => {
  await fetchCategories();
});

const fetchCategories = async () => {
  try {
    const response = await getCategories();
    categories.value = response.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las categorías.',
    });
  }
};

const createNewCategory = async () => {
  try {
    const response = await createCategory({ name: newCategory.value.name });
    categories.value.push(response.data);
    newCategory.value = { name: '' };
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Categoría creada correctamente.',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear la categoría.',
    });
  }
};

const startEdit = async (category: CategoryDTO) => {
  const { value: newName } = await Swal.fire({
    title: 'Editar Categoría',
    input: 'text',
    inputLabel: 'Nombre de la categoría',
    inputValue: category.name,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Guardar',
    confirmButtonColor: '#42b983',
    cancelButtonColor: '#34495e',
    inputValidator: (value) => {
      if (!value) {
        return '¡Debes ingresar un nombre!';
      }
    },
  });

  if (newName) {
    try {
      const response = await api.put(`/categories/update/${category.id}`, { name: newName });
      const index = categories.value.findIndex((cat) => cat.id === category.id);
      categories.value[index] = response.data;
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Categoría actualizada correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la categoría.',
      });
    }
  }
};

const confirmDelete = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la categoría permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#34495e',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      await deleteCategory(id);
      categories.value = categories.value.filter((cat) => cat.id !== id);
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'Categoría eliminada correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la categoría.',
      });
    }
  }
};
</script>

<style scoped>
input {
  background-color: #2c3e50;
  color: #ecf0f1;
}
input::placeholder {
  color: #bdc3c7;
}
button:hover {
  opacity: 0.9;
}
</style>
