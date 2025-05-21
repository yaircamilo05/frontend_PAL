<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <div v-if="loading">
      <p class="text-center text-lg text-gray-400">Cargando información del curso...</p>
      <div class="flex justify-center mt-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
    <div v-else-if="!courseDetails">
      <div class="text-center py-8">
        <p class="text-red-500 text-lg">No se pudo cargar la información del curso.</p>
        <p class="text-gray-400 mt-2">Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    </div>
    <div v-else class="course-content">
      <h1 class="text-2xl font-bold mb-4">{{ courseDetails.title }}</h1>
      
      <div class="bg-[#212121] p-4 rounded-md mb-6">
        <h2 class="text-xl font-semibold mb-2">Información del curso</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-gray-400"><span class="font-medium text-white">Categoría:</span> {{ courseDetails.category }}</p>
            <p class="text-gray-400"><span class="font-medium text-white">Instructor:</span> {{ courseDetails.instructor }}</p>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Descripción</h3>
          <p class="text-gray-300">{{ courseDetails.description }}</p>
        </div>
      </div>

      
      <div class="bg-[#212121] p-4 rounded-md">
        <h2 class="text-xl font-semibold mb-4">Material del curso</h2>
        <div v-if="courseDetails.exams && courseDetails.exams.length > 0">
          <h3 class="text-lg font-semibold mb-2">Exámenes disponibles</h3>
          <ul class="space-y-2">
            <li v-for="(exam, index) in courseDetails.exams" :key="exam.id" class="flex items-center">
              <span class="inline-block w-6 h-6 bg-vue-green text-center rounded-full mr-3">{{ index + 1 }}</span>
              <span>{{ exam.title }}</span>
              <button 
                @click="handleStartExam(exam)" 
                class="ml-auto py-1 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Iniciar
              </button>
            </li>
          </ul>
        </div>
        <div v-else-if="!courseDetails.exams">
          <p class="text-center text-red-400 py-4">
            La propiedad 'exams' no existe en los datos recibidos.
          </p>
        </div>
        <div v-else class="text-center text-gray-400 py-4">
          <p>No hay exámenes disponibles para este curso.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { getCourseDetails } from '@/services/api';
import { success, error } from '@/composables/alerts';

interface ExamGetBasic {
  id: number;
  title: string;
  description: string;
}

interface CourseDetails {
  title: string;
  description: string;
  category: string;
  instructor: string;
  exams: ExamGetBasic[];
}

const props = defineProps({
  courseId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['start-exam']);

const courseDetails = ref<CourseDetails | null>(null);
const loading = ref<boolean>(true);
const { showToast } = success();
const { showError } = error();

onMounted(async () => {
  try {
    loading.value = true;
    console.log('Cargando detalles del curso con ID:', props.courseId);
    const { data } = await getCourseDetails(props.courseId);
    console.log('Datos recibidos del API:', data);
    
    // Verificamos si hay que adaptar la estructura de datos
    if (data && !data.exams && data.examsNames) {
      // Si en lugar de 'exams' viene 'examsNames', adaptamos la estructura
      data.exams = Array.isArray(data.examsNames) 
        ? data.examsNames.map((name: string, index: number) => ({
            id: index + 1,
            title: name,
            description: ''
          }))
        : [];
    }
    
    courseDetails.value = data;
  } catch (e: any) {
    console.error('Error al cargar los detalles del curso:', e);
    showError('Error', e.message || 'No se pudo cargar la información del curso.');
  } finally {
    loading.value = false;
  }
});

function handleStartExam(exam: ExamGetBasic) {
  console.log('Iniciando examen:', exam.title);
  emit('start-exam', { courseId: props.courseId, examId: exam.id, examTitle: exam.title });
  console.log('Iniciando examen:', exam.title, 'con ID:', exam.id);
  
  // Verificamos que el usuario esté autenticado
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const userId = userInfo.id;
  
  if (!userId) {
    showError('Error', 'Necesitas iniciar sesión para realizar este examen.');
    return;
  }
  
  // Navegar a la ruta del examen
  window.location.href = `/student/exam/${exam.id}?userId=${userId}&returnTo=/student/course/${props.courseId}`;
}
</script>

<style scoped>
.course-content {
  max-width: 900px;
  margin: 0 auto;
}

pre {
  max-height: 200px;
}
</style>