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
            <p class="text-gray-400">
              <span class="font-medium text-white">Categoría:</span> {{ courseDetails.category.name}}
            </p>
            <p class="text-gray-400">
              <span class="font-medium text-white">Instructor:</span> {{ courseDetails.instructor.username}}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-semibold mb-2">Descripción</h3>
          <p class="text-gray-300">{{ courseDetails.description }}</p>
        </div>
      </div>

      <div class="bg-[#212121] p-4 rounded-md mb-6">
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

      <div class="bg-[#212121] p-4 rounded-md">
        <h2 class="text-xl font-semibold mb-4">Mis evaluaciones</h2>
        <div class="text-center mb-4">
          <button
            @click="navigateToCompletedExams"
            class="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors duration-200 flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Ver exámenes realizados
          </button>
        </div>
        <p class="text-gray-400 text-center text-sm">
          Revisa tus exámenes anteriores y consulta tus calificaciones
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCourseDetails } from '@/services/api';
import { success, error } from '@/composables/alerts';

interface ExamGetBasic {
  id: number;
  title: string;
  description: string;
}

interface Instructor {
  id: number;
  username: string;
}

interface Category {
  id: number;
  name: string;
}

interface CourseDetails {
  title: string;
  description: string;
  category: Category;
  instructor: Instructor;
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

    if (data && !data.exams && data.examsNames) {
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
  emit('start-exam', { courseId: props.courseId, examId: exam.id, examTitle: exam.title });

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const userId = userInfo.id;

  if (!userId) {
    showError('Error', 'Necesitas iniciar sesión para realizar este examen.');
    return;
  }

  window.location.href = `/student/exam/${exam.id}?userId=${userId}&returnTo=/student/course/${props.courseId}`;
}

function navigateToCompletedExams() {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const userId = userInfo.id;

  if (!userId) {
    showError('Error', 'Necesitas iniciar sesión para ver tus exámenes realizados.');
    return;
  }

  window.location.href = `/student/completed-exams/${props.courseId}/${userId}`;
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

.bg-vue-green {
  background-color: #42b883;
}

button {
  transition: transform 0.1s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
