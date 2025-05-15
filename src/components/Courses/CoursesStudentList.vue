<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-6">Cursos Disponibles</h2>
    <div v-if="localCourses.length === 0" class="text-vue-gray-light">
      No hay cursos disponibles.
    </div>
    <ul v-else class="space-y-6">
      <li
        v-for="course in localCourses"
        :key="course.id"
        class="flex flex-col p-3.5 m-3 bg-[#212121] rounded-md"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-semibold">{{ course.title }}</h3>
          <div class="flex items-center gap-4">
            <button
              @click="enroll(course)"
              class="inline-flex items-center justify-center px-4 py-2 text-green-500 hover:text-green-700 border-2 border-green-500 rounded-md"
            >
              Inscribirme
            </button>
            <button
              @click="showInfo(course)"
              class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
            >
              Más información
            </button>
          </div>
        </div>
        <p class="text-gray-400">{{ course.description }}</p>
        <div class="mt-2 grid grid-cols-3 gap-1">
          <p class="text-gray-400">Precio: ${{ course.price || 'N/A' }}</p>
          <p class="text-gray-400">Categoría: {{ course.category ? course.category.name : 'N/A' }}</p>
          <p class="text-gray-400">Instructor: {{ course.instructor ? course.instructor.username : 'N/A' }}</p>
        </div>
      </li>
    </ul>
    <!-- Modal para información -->
    <Modal v-model:isOpen="showInfoModal" title="Información del Curso">
      <div v-if="selectedCourse">
        <h3 class="text-lg font-bold mb-2">{{ selectedCourse.title }}</h3>
        <p class="mb-2">{{ selectedCourse.description }}</p>
        <p><strong>Precio:</strong> ${{ selectedCourse.price || 'N/A' }}</p>
        <p><strong>Categoría:</strong> {{ selectedCourse.category ? selectedCourse.category.name : 'N/A' }}</p>
        <p><strong>Instructor:</strong> {{ selectedCourse.instructor ? selectedCourse.instructor.username : 'N/A' }}</p>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, watch } from 'vue';
import type { Course } from '@/models/Course.model';
import Modal from '@/components/modal.vue';
import api from '@/services/api';
import { success, error } from '../../composables/alerts.ts';
import type { AxiosError } from 'axios';

export default defineComponent({
  name: 'CoursesStudentList',
  components: {
    Modal
  },
  props: {
    courses: {
      type: Array as PropType<Course[]>,
      required: true
    }
  },
  setup(props) {
    const localCourses = ref<Course[]>([...props.courses]);
    const showInfoModal = ref(false);
    const selectedCourse = ref<Course | null>(null);
    const { showToast } = success();
    const { showError } = error();

    watch(() => props.courses, (newCourses) => {
      localCourses.value = [...newCourses];
    }, { deep: true });

    const enroll = async (course: Course) => {
      try {
        await api.post(`/courses/enroll/${course.id}`);
        showToast('¡Inscripción exitosa!', 'Te has inscrito correctamente en el curso.');
      } catch (err) {
        const axiosError = err as AxiosError<any>;
        let errorMessage = 'Error desconocido.';
        if (axiosError.response?.data) {
          if (typeof axiosError.response.data === 'string') {
            errorMessage = axiosError.response.data;
          } else if ('message' in axiosError.response.data) {
            errorMessage = axiosError.response.data.message;
          }
        } else {
          errorMessage = axiosError.message;
        }
        showError('Error al inscribirse', errorMessage);
      }
    };

    const showInfo = (course: Course) => {
      selectedCourse.value = course;
      showInfoModal.value = true;
    };

    return {
      localCourses,
      enroll,
      showInfo,
      showInfoModal,
      selectedCourse
    };
  }
});
</script>
