<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-8">Contenido del Curso</h1>
    <CoursesContent 
      :courseId="courseId" 
      @start-exam="handleStartExam"
    />
    <div class="mt-4">
      <button 
        class="py-2 px-4 bg-slate-700 hover:bg-slate-800 text-white rounded" 
        @click="goBack"
      >
        Volver a mis inscripciones
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CoursesContent from '@/components/Courses/CoursesContent.vue';
import { success, error } from '@/composables/alerts';

const route = useRoute();
const router = useRouter();
const { showToast } = success();
const { showError } = error();

// Obtener el ID del curso de los parámetros de la ruta

const courseId = computed(() => {
  const id = parseInt(route.params.id as string, 10);
  console.log('ID del curso recibido en la ruta:', route.params.id);
  console.log('ID del curso convertido a número:', id);
  
  if (isNaN(id)) {
    showError('Error', 'ID de curso inválido');
    router.push('/student/my-enrollments');
    return 0;
  }
  
  return id;
});


function handleStartExam(data: { courseId: number, examId: number, examName: string }) {
  showToast('Examen', `Iniciando examen: ${data.examName}`);
  // Navegar a la ruta del examen con los parámetros necesarios
  router.push({
    name: 'student-exam',
    params: {
      examId: data.examId,
      examName: data.examName  // Add the examName parameter
    }
  });
}

function goBack() {
  router.push('/student/my-enrollments');
}
</script>
