<template>
  <div class="container mx-auto p-8 bg-vue-gray-light text-vue-text-light">
    <h1 class="text-3xl font-bold mb-10">Gestión de Cursos</h1>

    <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md mb-10">
      <h2 class="text-xl font-semibold mb-6">Crear Nuevo Curso</h2>
      <form @submit.prevent="createNewCourse" class="space-y-6">
        <div class="flex flex-col">
          <label for="title" class="block text-sm font-medium">Título</label>
          <input
            v-model="newCourse.title"
            type="text"
            id="title"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            placeholder="Ingrese el título del curso"
            required
          />
        </div>

        <div class="flex flex-col">
          <label for="description" class="block text-sm font-medium pt-3">Descripción</label>
          <input
            v-model="newCourse.description"
            type="text"
            id="description"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            placeholder="Ingrese la descripción del curso"
            required
          />
        </div>

        <div class="flex flex-col">
          <label for="price" class="block text-sm font-medium pt-3">Precio</label>
          <input
            v-model.number="newCourse.price"
            type="number"
            id="price"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            placeholder="Ingrese el precio del curso"
            required
          />
        </div>

        <div class="flex flex-col">
          <label for="categoryId" class="block text-sm font-medium pt-3">Categoría</label>
          <select
            v-model="newCourse.categoryId"
            id="categoryId"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            required
          >
            <option value="" disabled>Seleccione una categoría</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label for="instructorId" class="block text-sm font-medium pt-3"> Instructor</label>
          <select
            v-model="newCourse.instructorId"
            id="instructorId"
            class="mt-2 block w-full max-w-2xl h-12 rounded-md border-2 border-gray-300 !bg-[#262626] !text-white focus:border-vue-green focus:ring-2 focus:ring-vue-green sm:text-sm p-3"
            required
          >
            <option value="" disabled>Seleccione un instructor</option>
            <option v-for="instructor in instructors" :key="instructor.id" :value="instructor.id">
              {{ instructor.username }}
            </option>
          </select>
        </div>

        <div class="flex justify-start pt-3">
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-3 bg-vue-green text-green-500 hover:text-green-700 border-green-500 rounded-md hover:bg-vue-green-dark focus:outline-none focus:ring-2 focus:ring-vue-green border-2 border-vue-green"
          >
            Crear curso
          </button>
        </div>
      </form>
    </div>

    <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-6">Lista de Cursos</h2>
      <div v-if="courses.length === 0" class="text-vue-gray-light">
        No hay cursos disponibles.
      </div>
      <ul v-else class="space-y-6">
        <li
          v-for="course in courses"
          :key="course.id"
          class="flex flex-col p-3.5 m-3 bg-[#212121] rounded-md"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-xl font-semibold">{{ course.title }}</h3>
            <div class="flex items-center gap-4">
              <button
                @click="startEdit(course)"
                class="inline-flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md"
              >
                Editar
              </button>
              <button
                @click="confirmDelete(course.id)"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getCourses, createCourse, deleteCourse, getUserByRoleName, getCategories } from '@/services/api';
import api from '@/services/api';

interface CategoryDTO {
  id: number;
  name: string;
}

interface UserDTO {
  id: number;
  username: string;
}

interface CourseDTO {
  id: number;
  title: string;
  description: string;
  price: number;
  category: CategoryDTO;
  instructor: UserDTO;
}

interface CreateCourseDTO {
  title: string;
  description: string;
  price: number | null;
  categoryId: number | null;
  instructorId: number | null;
}

const courses = ref<CourseDTO[]>([]);
const newCourse = ref<CreateCourseDTO>({
  title: '',
  description: '',
  price: null,
  categoryId: null,
  instructorId: null
});

const instructors = ref<Array<{ id: number; username: string }>>([]);
const categories = ref<Array<{ id: number; name: string }>>([]);

onMounted(async () => {
  await fetchCourses();
  try {
    const [instructorsResponse, categoriesResponse] = await Promise.all([
      getUserByRoleName('INSTRUCTOR'),
      getCategories()
    ]);
    instructors.value = instructorsResponse.data;
    categories.value = categoriesResponse.data;
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

const fetchCourses = async () => {
  try {
    const response = await getCourses();
    courses.value = response.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los cursos.',
    });
  }
};

const createNewCourse = async () => {
  try {
    const response = await createCourse(newCourse.value);
    courses.value.push(response.data);
    newCourse.value = {
      title: '',
      description: '',
      price: null,
      categoryId: null,
      instructorId: null
    };
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Curso creado correctamente.',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear el curso.',
    });
  }
};

const startEdit = async (course: CourseDTO) => {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Curso',
    html:
      '<input id="swal-title" class="swal2-input" placeholder="Título" value="' + course.title + '">' +
      '<input id="swal-description" class="swal2-input" placeholder="Descripción" value="' + course.description + '">' +
      '<input id="swal-price" class="swal2-input" type="number" placeholder="Precio" value="' + course.price + '">' +
      '<input id="swal-category" class="swal2-input" type="number" placeholder="ID Categoría" value="' + (course.category?.id || '') + '">' +
      '<input id="swal-instructor" class="swal2-input" type="number" placeholder="ID Instructor" value="' + (course.instructor?.id || '') + '">',
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Guardar',
    confirmButtonColor: '#42b983',
    cancelButtonColor: '#34495e',
    preConfirm: () => {
      return {
        title: (document.getElementById('swal-title') as HTMLInputElement).value,
        description: (document.getElementById('swal-description') as HTMLInputElement).value,
        price: parseFloat((document.getElementById('swal-price') as HTMLInputElement).value),
        categoryId: parseInt((document.getElementById('swal-category') as HTMLInputElement).value),
        instructorId: parseInt((document.getElementById('swal-instructor') as HTMLInputElement).value)
      }
    }
  });

  if (formValues) {
    try {
      const response = await api.put(`/courses/update/${course.id}`, formValues);
      const index = courses.value.findIndex((c) => c.id === course.id);
      courses.value[index] = response.data;
      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Curso actualizado correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el curso.',
      });
    }
  }
};

const confirmDelete = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el curso permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#34495e',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      await deleteCourse(id);
      courses.value = courses.value.filter((course) => course.id !== id);
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'Curso eliminado correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el curso.',
      });
    }
  }
};
</script>

<style scoped>
input {
  background-color: #2c3e50;
  color: #ecf0f1;
}
input::placeholder {
  color: #bdc3c7;
}
button:hover {
  opacity: 0.9;
}
</style>