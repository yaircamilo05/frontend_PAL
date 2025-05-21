<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-white">Mis exámenes realizados</h1>

    <!-- Estado de carga -->
    <div v-if="loading" class="flex flex-col items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
      <p class="text-gray-400">Cargando resultados de exámenes...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="errorMessage" class="bg-red-900 bg-opacity-20 p-4 rounded-md mb-6">
      <p class="text-red-400">{{ errorMessage }}</p>
      <button 
        @click="fetchExamResults" 
        class="mt-3 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-sm"
      >
        Intentar nuevamente
      </button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="examResults.length === 0" class="text-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-400 mb-2">No has realizado ningún examen todavía</p>
      <p class="text-gray-500 text-sm">Los exámenes que completes aparecerán aquí</p>
    </div>

    <!-- Lista de resultados -->
    <div v-else>
      <div class="mb-4 p-3 bg-[#212121] rounded-md flex justify-between items-center">
        <p class="text-gray-300"><span class="font-medium text-white">Curso:</span> {{ courseDetails?.title || 'Curso' }}</p>
        <p class="text-gray-300 text-sm">{{ examResults.length }} exámenes realizados</p>
      </div>

      <div class="space-y-4">
        <div 
          v-for="result in examResults" 
          :key="result.attemptId" 
          class="bg-[#212121] p-4 rounded-md hover:bg-[#252525] transition-colors duration-200"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-semibold text-white">{{ result.examTitle }}</h3>
              <p class="text-sm text-gray-400">
                Realizado el {{ formatDate(result.submissionTime) }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                <span class="bg-blue-900 bg-opacity-40 px-2 py-0.5 rounded">{{ result.status }}</span>
              </p>
            </div>
            
            <div class="text-right">
              <div 
                class="text-lg font-bold mb-1" 
                :class="getScoreColorClass(result.percentageScore)"
              >
                {{ result.percentageScore }}%
              </div>
              <p class="text-xs text-gray-400">{{ result.score }}/{{ result.maxScore }} puntos</p>
            </div>
          </div>
          
          <div class="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              class="h-full rounded-full" 
              :class="getScoreColorClass(result.percentageScore)"
              :style="{ width: `${result.percentageScore}%` }"
            ></div>
          </div>
          
          <div class="mt-3 p-3 bg-[#1a1a1a] rounded-md text-sm text-gray-300">
            <p class="mb-1 text-xs text-gray-400">Retroalimentación:</p>
            <p>{{ result.feedback }}</p>
          </div>
          
          <div class="flex justify-end mt-3">
            <button 
              @click="viewExamDetails(result.attemptId)" 
              class="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
            >
              <span>Ver detalles</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCourseDetails, getExamResultsByUser } from '@/services/api';
import { error } from '@/composables/alerts';

// Estado
const route = useRoute();
const router = useRouter();
const examResults = ref<any[]>([]);
const loading = ref(true);
const errorMessage = ref('');
const courseDetails = ref<any>(null);
const { showError } = error();

// Obtener parámetros de la URL
const courseId = ref<number>(
  parseInt(route.query.courseId as string) || 
  parseInt(route.params.courseId as string) || 
  0
);
const userId = ref<number>(
  parseInt(route.query.userId as string) || 
  parseInt(route.params.userId as string) || 
  0
);

// Si no hay userId en los parámetros, intentar obtenerlo del sessionStorage
if (!userId.value) {
  try {
    const userInfoString = sessionStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      userId.value = userInfo.id;
    }
  } catch (e) {
    errorMessage.value = 'No se pudo obtener la información del usuario';
  }
}

onMounted(() => {
  fetchExamResults();
  if (courseId.value) {
    fetchCourseDetails();
  }
});

async function fetchExamResults() {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    if (!userId.value) {
      throw new Error('No se pudo identificar al usuario');
    }
      
    // Usar la función de API existente o adaptar según el endpoint real
    const { data } = await getExamResultsByUser(courseId.value, userId.value);
    examResults.value = data;
    
    console.log('Resultados obtenidos:', data);
  } catch (e: any) {
    console.error('Error al obtener resultados:', e);
    errorMessage.value = e.message || 'Error al cargar los resultados de exámenes';
    showError('Error', errorMessage.value);
  } finally {
    loading.value = false;
  }
}

async function fetchCourseDetails() {
  try {
    if (courseId.value) {
      const { data } = await getCourseDetails(courseId.value);
      courseDetails.value = data;
    }
  } catch (e) {
    console.error('Error al obtener detalles del curso:', e);
  }
}

function formatDate(dateString: string) {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

function getScoreColorClass(score: number) {
  if (score >= 80) return 'text-green-500 bg-green-500';
  if (score >= 60) return 'text-yellow-500 bg-yellow-500';
  return 'text-red-500 bg-red-500';
}

function viewExamDetails(attemptId: number) {
  router.push(`/student/exam-result/${attemptId}`);
}
</script>

<style scoped>
.text-green-500 { color: #10b981; }
.text-yellow-500 { color: #f59e0b; }
.text-red-500 { color: #ef4444; }

.bg-green-500 { background-color: #10b981; }
.bg-yellow-500 { background-color: #f59e0b; }
.bg-red-500 { background-color: #ef4444; }
</style>