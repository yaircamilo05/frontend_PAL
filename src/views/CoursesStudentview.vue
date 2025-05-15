<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-8">Explora Cursos</h1>
    <SearchCourses @search="handleSearch" />
    <CoursesStudentList :courses="filteredCourses" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SearchCourses from '@/components/Courses/SearchCourses.vue';
import CoursesStudentList from '@/components/Courses/CoursesStudentList.vue';
import api from '@/services/api';
import type { Course } from '@/models/Course.model';

const allCourses = ref<Course[]>([]);
const filteredCourses = ref<Course[]>([]);

onMounted(async () => {
  try {
    const { data } = await api.get('/courses/all');
    allCourses.value = data;
    filteredCourses.value = data;
  } catch (e) {
    console.error('Error al cargar cursos:', e);
    allCourses.value = [];
    filteredCourses.value = [];
  }
});

function handleSearch(filters: { keyword: string; maxPrice: string; categoryId: string }) {
  let result = allCourses.value;
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(c =>
      c.title.toLowerCase().includes(kw) ||
      c.description.toLowerCase().includes(kw)
    );
  }
  if (filters.maxPrice) {
    const max = parseFloat(filters.maxPrice);
    result = result.filter(c => c.price <= max);
  }
  if (filters.categoryId) {
    result = result.filter(c => c.category && String(c.category.id) === String(filters.categoryId));
  }
  filteredCourses.value = result;
}
</script>
