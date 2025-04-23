<template>
  <div class="">
    <h1 class="text-3xl font-bold mb-10">Gestión de Cursos</h1>

    <CoursesManagement v-slot="{ instructors, categories }">
      <div class="contenedor_interno">
        <h2 class="text-xl font-semibold mb-6">Crear Nuevo Curso</h2>
        <CourseForm :isCreateMode="true" :categories="categories ?? []" :instructors="instructors ?? []"
          @submit="createNewCourse" />
      </div>
    </CoursesManagement>

    <div class="contenedor_interno">
      <CourseList :courses="courses" @edit="startEdit" @delete="confirmDeleteCourse" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/api';
import CourseForm from '@/components/Courses/CoursesForm.vue';
import CourseList from '@/components/Courses/CoursesList.vue';
import CoursesManagement from '@/components/Courses/CoursesManagment.vue';

const courses = ref([]);
const newCourse = ref({ title: '', description: '', price: 0, categoryId: 0, instructorId: 0 });

const isLoading = ref(false);

const fetchCourses = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/courses/all');
    courses.value = response.data;
  } catch (error) {
    console.error('Error al cargar cursos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los cursos.'
    });
  } finally {
    isLoading.value = false;
  }
};

const createNewCourse = async (courseData) => {
  try {
    const response = await api.post('/courses/create', courseData);
    courses.value.push(response.data);
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Curso creado correctamente.', timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el curso.' });
  }
};

const startEdit = (course) => {
  console.log('Editar curso:', course);
};

const confirmDeleteCourse = (courseId) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede revertir',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteCourse(courseId);
    }
  });
};

const deleteCourse = async (courseId) => {
  try {
    await api.delete(`/courses/${courseId}`);
    courses.value = courses.value.filter(course => course.id !== courseId);
    Swal.fire({
      title: '¡Eliminado!',
      text: 'El curso ha sido eliminado.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el curso.'
    });
  }
};

onMounted(fetchCourses);
</script>