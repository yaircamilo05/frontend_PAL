<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-8">Explora Cursos</h1>
    <SearchCourses @search="handleSearch" />
    <CoursesStudentList :courses="filteredCourses" @enroll="handleEnroll" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SearchCourses from '@/components/Courses/SearchCourses.vue';
import CoursesStudentList from '@/components/Courses/CoursesStudentList.vue';
import api, { enrollCourse } from '@/services/api';
import type { Course } from '@/models/Course.model';
import { success, error } from '@/composables/alerts';

const allCourses = ref<Course[]>([]);
const filteredCourses = ref<Course[]>([]);
const { showToast } = success();
const { showError } = error();

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

async function handleEnroll(course: Course) {
  try {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const userId = userInfo.id;
    if (!userId) throw new Error('No se encontró el usuario autenticado.');
    await enrollCourse(course.id, userId);
    showToast('¡Inscripción exitosa!', 'Te has inscrito correctamente en el curso.');
  } catch (err: any) {
    let errorMessage = 'Error desconocido.';
    if (err.response?.data) {
      if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      } else if ('message' in err.response.data) {
        errorMessage = err.response.data.message;
      }
    } else {
      errorMessage = err.message;
    }
    showError('Error al inscribirse', errorMessage);
  }
}
</script>
