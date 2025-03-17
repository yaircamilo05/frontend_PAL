<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestión de Contenido</h1>

    <div class="mb-4 flex gap-4">
      <select v-model="selectedCourse" class="border p-2 rounded">
        <option value="" disabled>Seleccione un curso</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>

      <input type="file" @change="handleFileUpload" class="border p-2 rounded" />
      <button @click="uploadFile" class="bg-blue-500 text-white px-4 py-2 rounded">Subir</button>
    </div>

    <ul class="mt-4">
      <li v-for="content in contents" :key="content.id" class="border-b py-2 flex justify-between items-center">
        <div>
          <a :href="content.url" target="_blank" class="text-blue-500 underline">
            {{ content.type }}
            <img :src="content.url" alt="Imagen" class="w-32 h-32 object-cover rounded-lg" />
          </a>
        </div>
        <button @click="confirmDelete(content.id)" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getContent, uploadContent, deleteContent, getCourses } from '../services/api'; // Importamos las funciones

const selectedCourse = ref(null);
const courses = ref([]);
const contents = ref([]);
const file = ref(null);

onMounted(async () => {
  await fetchCourses();
  await fetchContents();
});

const fetchCourses = async () => {
  try {
    const response = await getCourses();
    courses.value = response.data;
  } catch (error) {
    console.error("Error obteniendo cursos:", error);
  }
};

const fetchContents = async () => {
  try {
    const response = await getContent();
    contents.value = response.data;
  } catch (error) {
    console.error("Error obteniendo contenido:", error);
  }
};

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

const uploadFile = async () => {
  if (!file.value || !selectedCourse.value) {
    Swal.fire('Error', 'Seleccione un curso y un archivo', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('courseId', selectedCourse.value); // Agregamos el ID del curso

  try {
    await uploadContent(formData);
    Swal.fire('Éxito', 'Archivo subido correctamente', 'success');
    file.value = null;
    await fetchContents();
  } catch (error) {
    Swal.fire('Error', 'No se pudo subir el archivo', 'error');
  }
};

const confirmDelete = (id) => {
  Swal.fire({
    title: '¿Seguro que quieres eliminar?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      await removeContent(id);
    }
  });
};

const removeContent = async (id) => {
  try {
    await deleteContent(id);
    Swal.fire('Eliminado', 'El contenido ha sido eliminado', 'success');
    await fetchContents();
  } catch (error) {
    Swal.fire('Error', 'No se pudo eliminar', 'error');
  }
};
</script>

<style scoped>
/* Puedes agregar más estilos aquí si es necesario */
</style>
