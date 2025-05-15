<template>
  <form @submit.prevent="emitFilters" class="flex flex-col md:flex-row gap-4 items-end bg-[#212121] p-4 rounded-lg mb-6">
    <!-- Palabras clave -->
    <div class="flex flex-col w-full md:w-1/3">
      <label for="keyword" class="text-sm font-medium mb-1">Palabras clave</label>
      <input v-model="keyword" id="keyword" type="text" placeholder="Buscar por nombre o descripción"
        class="rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 p-2" />
    </div>
    <!-- Precio máximo -->
    <div class="flex flex-col w-full md:w-1/4">
      <label for="maxPrice" class="text-sm font-medium mb-1">Precio máximo</label>
      <select v-model="maxPrice" id="maxPrice"
        class="rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 p-2">
        <option value="">Sin límite</option>
        <option v-for="price in priceOptions" :key="price" :value="price">Hasta ${{ price }}</option>
      </select>
    </div>
    <!-- Categoría -->
    <div class="flex flex-col w-full md:w-1/4">
      <label for="category" class="text-sm font-medium mb-1">Categoría</label>
      <select v-model="selectedCategory" id="category"
        class="rounded-md border-2 border-gray-300 bg-gray-100 text-gray-900 dark:bg-[#292929] dark:text-gray-100 p-2">
        <option value="">Todas</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>
    <button type="submit"
      class="bg-vue-green text-white px-4 py-2 rounded-md hover:bg-vue-green-dark transition">Buscar</button>
  </form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getCategories } from '@/services/api';

const emit = defineEmits(['search']);

const keyword = ref('');
const maxPrice = ref('');
const selectedCategory = ref('');
const categories = ref<{ id: number; name: string }[]>([]);
const priceOptions = [10, 25, 50, 100, 200, 500, 1000];

onMounted(async () => {
  try {
    const { data } = await getCategories();
    categories.value = data;
  } catch (e) {
    categories.value = [];
  }
});

function emitFilters() {
  emit('search', {
    keyword: keyword.value,
    maxPrice: maxPrice.value,
    categoryId: selectedCategory.value
  });
}
</script>
