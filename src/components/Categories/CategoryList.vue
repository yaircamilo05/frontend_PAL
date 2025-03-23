<template>
    <div>
      <h2 class="text-xl font-semibold mb-6">Lista de Categorías</h2>
      <div v-if="localCategories.length === 0" class="text-vue-gray-light">
        No hay categorías disponibles.
      </div>
      <ul v-else class="space-y-6">
        <li
          v-for="category in localCategories"
          :key="category.id"
          class="flex items-center justify-between p-3.5 m-3 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 rounded-md border-2 border-gray-300 focus-within:border-vue-green focus-within:ring-2 focus-within:ring-vue-green"
        >
          <span class="text-sm font-medium pr-10">{{ category.name }}</span>
          <div class="flex items-center gap-4">
            <button
              @click="openEditModal(category)"
              class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
            >
              Editar
            </button>
            <button
              @click="handleDeleteCategory(category.id)"
              class="inline-flex items-center justify-center px-4 py-2 text-red-500 hover:text-red-700 border-2 border-red-500 rounded-md"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
  
      <!-- Modal -->
      <Modal v-model:isOpen="showEditModal" title="Editar Categoría">
        <CategoryForm 
          v-if="selectedCategory" 
          :category="selectedCategory" 
          :isCreateMode="false"
          @submit="submitEditForm"
        />
      </Modal>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, type PropType, ref, watch } from 'vue';
  import type { Category } from '@/models/Category.model';
  import Modal from '@/components/modal.vue';
  import CategoryForm from './CategoryForm.vue';
  import api, { deleteCategory } from '@/services/api';
  import { success, error, confirmation } from '../../composables/alerts.ts';
  
  export default defineComponent({
    name: 'CategoryList',
    components: {
      Modal,
      CategoryForm
    },
    props: {
      categories: {
        type: Array as PropType<Category[]>,
        required: true
      }
    },
    emits: ['delete', 'edit', 'category-updated', 'category-deleted'],
    setup(props, { emit }) {
      const showEditModal = ref(false);
      const selectedCategory = ref<any>(null);
      const editingCategoryId = ref<number | null>(null);
      const localCategories = ref<Category[]>([...props.categories]);
      
      const { showToast } = success();
      const { showError } = error();
      const { confirmDeletion } = confirmation();
  
      watch(() => props.categories, (newCategories) => {
        localCategories.value = [...newCategories];
      }, { deep: true });
  
      const openEditModal = (category: Category) => {      
        editingCategoryId.value = category.id;
        selectedCategory.value = {
          id: category.id,
          name: category.name
        };
        showEditModal.value = true;
      };
  
      const handleDeleteCategory = async (categoryId: number) => {
        const result = await confirmDeletion();
        
        if (result.isConfirmed) {
          try {
            await deleteCategory(categoryId);
            localCategories.value = localCategories.value.filter(category => category.id !== categoryId);
            emit('category-deleted', categoryId);
            showToast('¡Categoría eliminada!', 'La categoría ha sido eliminada correctamente.');
          } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            showError('Error', 'No se pudo eliminar la categoría. Por favor, intenta de nuevo.');
          }
        }
      };
  
      const submitEditForm = async (updatedCategory: any) => {
        try {
          const categoryToUpdate = {
            ...updatedCategory,
            id: editingCategoryId.value
          };
          
          const response = await api.put(`/categories/update/${categoryToUpdate.id}`, categoryToUpdate);
          
          const index = localCategories.value.findIndex(category => category.id === categoryToUpdate.id);
          if (index !== -1) {
            localCategories.value[index] = {
              ...localCategories.value[index],
              ...response.data
            };
          }
          
          emit('category-updated', response.data);
          showToast('¡Categoría actualizada!', 'La categoría ha sido actualizada correctamente.');
          showEditModal.value = false;
        } catch (error) {
          console.error('Error al actualizar la categoría:', error);
          showError('Error', 'No se pudo actualizar la categoría. Por favor, intenta de nuevo.');
        }
      };
  
      return {
        showEditModal,
        selectedCategory,
        localCategories,
        openEditModal,
        handleDeleteCategory,
        submitEditForm
      };
    }
  });
  </script>