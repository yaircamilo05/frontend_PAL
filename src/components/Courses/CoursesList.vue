<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-6">Lista de Cursos</h2>
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
              @click="openEditModal(course)"
              class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
            >
              Editar
            </button>
            <button
              @click="handleDeleteCourse(course.id)"
              class="inline-flex items-center justify-center px-4 py-2 text-red-500 hover:text-red-700 border-2 border-red-500 rounded-md"
            >
              Eliminar
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

    <!-- Modal -->
    <Modal v-model:isOpen="showEditModal" title="Editar Curso">
      <CourseForm 
        v-if="selectedCourse" 
        :course="selectedCourse" 
        :isCreateMode="false"
        @submit="submitEditForm"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, watch } from 'vue';
import type { Course } from '@/models/Course.model';
import Modal from '@/components/modal.vue';
import CourseForm from './CoursesForm.vue';
import api from '@/services/api';
import { success, error, confirmation } from '../../composables/alerts.ts';
import type { AxiosError } from 'axios';

export default defineComponent({
  name: 'CourseList',
  components: {
    Modal,
    CourseForm
  },
  props: {
    courses: {
      type: Array as PropType<Course[]>,
      required: true
    }
  },
  emits: ['delete', 'edit', 'course-updated', 'course-deleted'],
  setup(props, { emit }) {
    const showEditModal = ref(false);
    const selectedCourse = ref<any>(null);
    const editingCourseId = ref<number | null>(null);
    const localCourses = ref<Course[]>([...props.courses]);

    const { showToast } = success();
    const { showError } = error();
    const { confirmDeletion } = confirmation();

    watch(() => props.courses, (newCourses) => {
      localCourses.value = [...newCourses];
    }, { deep: true });

    const openEditModal = (course: Course) => {
      editingCourseId.value = course.id;

      selectedCourse.value = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        instructor: course.instructor
      };

      showEditModal.value = true;
    };

    const handleDeleteCourse = async (courseId: number) => {
      const result = await confirmDeletion();

      if (result.isConfirmed) {
        try {
          await api.delete(`/courses/delete/${courseId}`);
          localCourses.value = localCourses.value.filter(course => course.id !== courseId);
          emit('course-deleted', courseId);
          showToast('¡Curso eliminado!', 'El curso ha sido eliminado correctamente.');
        } catch (err) {
          console.error('Error al eliminar el curso:', err);

          const error = err as AxiosError<any>;
          let errorMessage = 'Error desconocido.';

          if (error.response?.data) {
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else if ('message' in error.response.data) {
              errorMessage = error.response.data.message;
            }
          } else {
            errorMessage = error.message;
          }

          showError('Error al eliminar', errorMessage);
        }
      }
    };

    const submitEditForm = async (updatedCourse: any) => {
      try {
        const courseToUpdate = {
          ...updatedCourse,
          id: editingCourseId.value
        };
        const response = await api.put(`/courses/update/${courseToUpdate.id}`, courseToUpdate);

        const index = localCourses.value.findIndex(course => course.id === courseToUpdate.id);
        if (index !== -1) {
          localCourses.value[index] = {
            ...localCourses.value[index],
            ...response.data
          };
        }

        emit('course-updated', response.data);
        showToast('¡Curso actualizado!', 'El curso ha sido actualizado correctamente.');

        showEditModal.value = false;

      } catch (error) {
        console.error('Error al actualizar el curso:', error);
        showError('Error', 'No se pudo actualizar el curso. Por favor, intenta de nuevo.');
      }
    };

    return {
      showEditModal,
      selectedCourse,
      localCourses,
      openEditModal,
      handleDeleteCourse,
      submitEditForm
    };
  }
});
</script>
