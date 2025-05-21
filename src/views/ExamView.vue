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
        @submit="handleExamSubmit"
        @cancel="goBack"
      />
    </div>
    
    <div v-else-if="viewMode === 'finish'" class="text-center py-10">
      <h1 class="text-3xl font-bold mb-4">¡Examen completado!</h1>
      <p class="text-xl text-gray-300 mb-8">Tu examen ha sido enviado correctamente.</p>
      <div class="bg-[#212121] max-w-md mx-auto p-6 rounded-lg mb-8">
        <p v-if="examResult" class="mb-4">
          Tu puntuación: <span class="font-bold text-vue-green">{{ examResult.score }} / {{ examResult.maxScore }}</span>
        </p>
        <p v-else class="mb-4">Recibirás los resultados una vez que el examen sea calificado.</p>
        <p class="text-vue-green">Gracias por completar el examen.</p>
      </div>
      <button 
        @click="goBack" 
        class="py-3 px-6 bg-slate-700 hover:bg-slate-800 text-white rounded"
      >
        Volver al curso
      </button>
    </div>
    
    <!-- Loader para mostrar mientras se envían las respuestas -->
    <div v-else-if="viewMode === 'finish'" class="text-center py-10">
      <h1 class="text-3xl font-bold mb-4">¡Examen completado!</h1>
      <p class="text-xl text-gray-300 mb-8">Tu examen ha sido enviado correctamente.</p>
      <div class="bg-[#212121] max-w-md mx-auto p-6 rounded-lg mb-8">
        <p v-if="examResult" class="mb-4">
          Tu puntuación: 
        </p>
        <p v-else class="mb-4">Recibirás los resultados una vez que el examen sea calificado.</p>
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
import { submitExamAnswers } from '@/services/api'; // Importa la función de API que debes crear
import { success, error } from '@/composables/alerts';

const route = useRoute();
const router = useRouter();
const { showToast } = success();
const { showError } = error();

// Modo de visualización: 'start' | 'exam' | 'finish'
const viewMode = ref<'start' | 'exam' | 'finish'>('start');
const isSubmitting = ref(false);

// Datos del examen
const examId = ref<number>(parseInt(route.params.examId as string, 10));
const examName = ref<string>(route.params.examName as string || 'Examen');
const examData = ref<any>(null);
const examResult = ref<any>(null);

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

// Manejar envío de respuestas
async function handleExamSubmit(data: { answers: any[], examId: number, userId: number }) {
  console.log('Submitting exam answers:', data);
  
  isSubmitting.value = true;
  
  try {
    // Preparar los datos para la API en el formato requerido
    const submission = {
      answers: data.answers
    };
    
    // Llamar a la API para enviar las respuestas
    const result = await submitExamAnswers(data.examId, data.userId, submission);
    
    // Guardar el resultado completo
    examResult.value = result.data || result;
    console.log('Exam submission result:', examResult.value);
    showToast('Éxito', 'Tu examen ha sido enviado correctamente');
    viewMode.value = 'finish';
  } catch (e: any) {
    console.error('Error al enviar las respuestas:', e);
    showError('Error', e.message || 'No se pudieron enviar las respuestas. Inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
}

// Volver a la página anterior
function goBack() {
  router.push('/student/my-enrollments');
}
</script>

<style scoped>
.text-vue-green {
  color: #42b883;
}
</style>