<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Reportes de Progreso del Estudiante</h2>

    <!-- Generar reporte -->
    <div class="bg-gray-100 dark:bg-[#292929] p-4 rounded-md border border-gray-300 space-y-4">
      <label class="block text-sm font-medium">Curso</label>
      <select
        v-model="selectedCourseId"
        class="block w-full h-12 rounded-md border border-gray-300 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 px-3"
      >
        <option v-for="course in enrolledCourses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>

      <div class="flex gap-4">
        <button
          @click="handleDownload('pdf')"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Descargar PDF
        </button>
        <button
          @click="handleDownload('csv')"
          class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Descargar CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { error } from '@/composables/alerts';

const studentId = 1; // ⚠️ Puedes cambiarlo si usas store (ej: Vuex o Pinia)
const enrolledCourses = ref<{ id: number; title: string }[]>([]);
const selectedCourseId = ref<number | null>(null);

const { showError } = error();

onMounted(() => {
  loadCourses();
});

const loadCourses = async () => {
  try {
    const response = await api.get(`/enrollments/my-courses/${studentId}`);
    console.log('Cursos cargados:', response.data);
    enrolledCourses.value = response.data.map((enrollment: any) => ({
      id: enrollment.courseId,
      title: enrollment.courseName
    }));
  } catch (err) {
    console.error(err);
    showError('Error', 'No se pudieron cargar los cursos');
  }
};

const handleDownload = async (type: 'pdf' | 'csv') => {
  if (!selectedCourseId.value) return;
  try {
    const endpoint = `/reports/progress/${selectedCourseId.value}/${type}`;
    const filename = `reporte_curso_${selectedCourseId.value}.${type}`;

    const response = await api.get(endpoint, {
      responseType: type === 'pdf' ? 'arraybuffer' : 'blob',
    });

    const blob = new Blob([response.data], {
      type: type === 'pdf' ? 'application/pdf' : 'text/csv;charset=utf-8',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    showError('Error', `No se pudo descargar el reporte en formato ${type.toUpperCase()}`);
  }
};
</script>
