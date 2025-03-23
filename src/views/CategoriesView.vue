<template>
<div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-10">Gestión de Categorias</h1>

    <div class="contenedor_interno">
      <h2 class="text-xl font-semibold mb-6">Crear nueva Categoria</h2>
      <CategoryForm :isCreateMode="true" @submit="createNewCategory" />
    </div>

    <div class="contenedor_interno">
      <CategoryList 
        :categories="categories" 
        @edit="startEdit" 
        @delete="confirmDeleteCategory" 
      />
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api';
import CategoryForm from '@/components/Categories/CategoryForm.vue';
import CategoryList from '@/components/Categories/CategoryList.vue';

const categories = ref([]);
const newCategory= ref({ name: ''});

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/all');
    categories.value = response.data;
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los usuarios.' });
  }
};

const createNewCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories/create', categoryData);
    categories.value.push(response.data);
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Categoria creada correctamente.', timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear la categoria.' });
  }
};

const startEdit = (category) => {
  console.log('Editar categoria:', category);
};

const confirmDeleteCategory = (categoryId) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede revertir',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteCategory(categoryId);
    }
  });
};

const deleteCategory = async (categoryId) => {
  try {
    await api.delete(`/categories/${categoryId}`);
    categories.value = categories.value.filter(category => category.id !== categoryId);
    Swal.fire({
      title: '¡Eliminado!',
      text: 'La categoria ha sido eliminada.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la categoria.'
    });
  }
};

onMounted(fetchCategories);
</script>