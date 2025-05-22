<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Certificados del Estudiante</h2>

    <!-- Generar certificado -->
    <div class="bg-gray-100 dark:bg-[#292929] p-4 rounded-md border border-gray-300 space-y-4">
      <label class="block text-sm font-medium">Curso</label>
      <select
        v-model="selectedCourseId"
        class="block w-full h-12 rounded-md border border-gray-300 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 px-3"
      >
        <option v-for="course in enrolledCourses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>

      <button
        @click="handleGenerateCertificate"
        class="px-6 py-2 bg-vue-green text-white rounded-md hover:bg-vue-green-dark"
      >
        Generar certificado
      </button>
    </div>

    <!-- Lista de certificados -->
    <div>
      <h3 class="text-lg font-semibold mt-4">Mis Certificados</h3>

      <div v-if="certificates.length === 0" class="text-gray-500 mt-2">
        No tienes certificados generados aún.
      </div>

      <ul class="space-y-4 mt-4">
        <li
          v-for="cert in certificates"
          :key="cert.id"
          class="p-4 bg-gray-100 dark:bg-[#292929] rounded-md border border-gray-300 flex justify-between items-center"
        >
          <div>
            <p class="font-medium">{{ cert.courseTitle }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">Emitido el: {{ formatDate(cert.issuedAt) }}</p>
          </div>
          <button
            @click="handleDownload(cert.id)"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Descargar
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Certificate } from '@/models/Certificate.model';
import type { Course } from '@/models/Course.model';
import { fetchStudentCertificates, generateCertificate, downloadCertificate } from '@/services/api';
import api from '@/services/api';
import { success, error } from '@/composables/alerts';

const studentId = 1; // Puedes reemplazarlo dinámicamente si lo tienes en el store
const certificates = ref<Certificate[]>([]);
const enrolledCourses = ref<Course[]>([]);
const selectedCourseId = ref<number | null>(null);

const { showToast } = success();
const { showError } = error();

onMounted(async () => {
  await loadCertificates();
  await loadEnrolledCourses();
});

const loadCertificates = async () => {
  try {
    certificates.value = await fetchStudentCertificates(studentId);
  } catch (err) {
    console.error(err);
    showError('Error', 'No se pudieron cargar los certificados');
  }
};

const loadEnrolledCourses = async () => {
  try {
    const response = await api.get(`/enrollments/my-courses/${studentId}`);
    console.log('Respuesta cursos:', response.data);

    enrolledCourses.value = response.data.map((enrollment: any) => ({
      id: enrollment.courseId,
      title: enrollment.courseName
    }));
  } catch (err) {
    console.error(err);
    showError('Error', 'No se pudieron cargar los cursos');
  }
};

const handleGenerateCertificate = async () => {
  if (!selectedCourseId.value) return;
  try {
    const cert = await generateCertificate(selectedCourseId.value, studentId);
    certificates.value.push(cert);
    showToast('¡Certificado generado!', 'Tu certificado ha sido creado exitosamente.');
  } catch (err: any) {
    console.error(err);
    const message = err.response?.data?.message || 'No se pudo generar el certificado.';
    showError('Error', message);
  }
};

const handleDownload = async (certificateId: number) => {
  try {
    const blob = await downloadCertificate(certificateId);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `certificado_${certificateId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    showError('Error', 'No se pudo descargar el certificado.');
  }
};

const formatDate = (dateStr: string) => {
  const trimmed = dateStr.split('.')[0]; 
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    console.warn('Fecha inválida recibida:', dateStr);
    return 'Fecha inválida';
  }
  return parsed.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


</script>
