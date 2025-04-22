<template>
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
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/services/api';
  import { success, error } from '../../composables/alerts.ts';
  
  const props = defineProps({
    content: {
      type: Object,
      default: () => ({ type: '', url: '', courseId: 0 })
    },
    isCreatedMode: {
      type: Boolean,
      default: true,
    }
  });
  
  const emit = defineEmits(['submit']);
  
  const selectedCourse = ref(null);
  const courses = ref([]);
  const file = ref(null);
  const isSubmitting = ref(false);
  const { showToast } = success();
  const { showError } = error();
  
  onMounted(() => {
    fetchCourses();
  });
  
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/all');
      courses.value = response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      showError('Error', 'No se pudieron cargar los cursos.');
    }
  };
  
  const handleFileUpload = (event) => {
    const selected = event.target.files[0];
    if (!selected) return;
  
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  
    if (!allowedTypes.includes(selected.type)) {
      showError('Archivo inválido', 'Solo se permiten imágenes (JPG, PNG) o archivos PDF.');
      file.value = null;
      return;
    }
  
    file.value = selected;
  };
  
  const uploadFile = async () => {
    if (!file.value || !selectedCourse.value) {
      showError('Error', 'Seleccione un curso y un archivo');
      return;
    }
  
    const contentData = {
      file: file.value,
      courseId: selectedCourse.value,
      type: file.value.type,
      url: ''
    };
  
    try {
      const formData = new FormData();
      formData.append('file', file.value);
      formData.append('courseId', String(selectedCourse.value));
  
      const response = await api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      showToast('Éxito', 'Archivo subido correctamente');
      file.value = null;
      emit('submit', contentData);
    } catch (error) {
      console.error('Error al subir archivo:', error);
      showError('Error', 'No se pudo subir el archivo: ' + (error.response?.data?.message || error.message));
    }
  };
  </script>
  