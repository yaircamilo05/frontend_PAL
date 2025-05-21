<template>
  <div class="contenedor_general">
    <div v-if="viewMode === 'start'" class="mb-8">
      <h1 class="text-3xl font-bold mb-8">Iniciar Examen</h1>
      <ExamStart 
        :examId="examId" 
        :examName="examName"
        @start="handleExamStart"
        @cancel="goBack"
      />
    </div>
    <div v-else-if="viewMode === 'exam'" class="w-full">
      <ExamTaker 
        :examData="examData"
        @finish="handleExamFinish"
        @cancel="goBack"
      />
    </div>
    
    <div v-else-if="viewMode === 'finish'" class="text-center py-10">
      <h1 class="text-3xl font-bold mb-4">¡Examen completado!</h1>
      <p class="text-xl text-gray-300 mb-8">Tu examen ha sido enviado correctamente.</p>
      <div class="bg-[#212121] max-w-md mx-auto p-6 rounded-lg mb-8">
        <p class="mb-4">Recibirás los resultados una vez que el examen sea calificado.</p>
        <p class="text-vue-green">Gracias por completar el examen.</p>
      </div>
      <button 
        @click="goBack" 
        class="py-3 px-6 bg-slate-700 hover:bg-slate-800 text-white rounded"
      >
        Volver al curso
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ExamStart from '@/components/Exams/ExamStart.vue';
import ExamTaker from '@/components/Exams/ExamTaker.vue';
import { success, error } from '@/composables/alerts';

const route = useRoute();
const router = useRouter();
const { showToast } = success();
const { showError } = error();

// Modo de visualización: 'start' | 'exam' | 'finish'
const viewMode = ref<'start' | 'exam' | 'finish'>('start');

// Datos del examen
const examId = ref<number>(parseInt(route.params.examId as string, 10));
const examName = ref<string>(route.params.examName as string || 'Examen');
const examData = ref<any>(null);

// Obtener el ID del usuario autenticado
const userId = ref<number>(0);

onMounted(() => {
  if (isNaN(examId.value)) {
    showError('Error', 'ID de examen inválido');
    router.push('/student/my-enrollments');
    return;
  }
  
  // Obtener el ID del usuario autenticado
  try {
    const userInfoString = sessionStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      userId.value = userInfo.id;
      
      if (!userId.value) {
        throw new Error('ID de usuario no encontrado');
      }
    } else {
      throw new Error('Información de usuario no encontrada');
    }
  } catch (e) {
    showError('Error', 'No se pudo obtener la información del usuario');
    router.push('/login');
  }
});

// Manejar inicio del examen
function handleExamStart(data: any) {
  console.log('Exam data received:', data);
  examData.value = data;
  viewMode.value = 'exam';
}

// Manejar finalización del examen
function handleExamFinish() {
  viewMode.value = 'finish';
}

// Volver a la página anterior
function goBack() {
  router.push('/student/my-enrollments');
}
</script>
