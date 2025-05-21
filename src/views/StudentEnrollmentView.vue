<template>
  <div class="contenedor_general">
    <h1 class="text-3xl font-bold mb-8">Mis Inscripciones</h1>
    <EnrollmentList
      :enrollments="enrollments"
      @pay="handlePay"
      @enter="handleEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EnrollmentList from '@/components/Enrollments/EnrollmentList.vue';
import { getMyEnrollments, processPayment } from '@/services/api';
import { success, error } from '@/composables/alerts';
import type { Enrollment } from '@/models/Enrollment.model';

const router = useRouter();
const enrollments = ref<Enrollment[]>([]);
const { showToast } = success();
const { showError } = error();

const mappedEnrollments = computed(() =>
  enrollments.value.map((e, idx) => ({
    id: e.courdId || idx,
    paid: e.paymentStatus === 'PAID',
    course: {
      id: e.courdId,
      title: e.courseName
    }
  }))
);

onMounted(async () => {
  try {
    const userInfoStr = sessionStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
    const userId = userInfo.id;
    if (!userId) throw new Error('No se encontró el usuario autenticado.');
    const { data } = await getMyEnrollments(userId);
    enrollments.value = data;
    console.log('Inscripciones:', data);
  } catch (e: any) {
    showError('Error', e.message || 'No se pudieron cargar las inscripciones.');
  }
});

function handlePay(enrollment: any) {
  processPayment(enrollment.paymentId)
    .then(() => {
      showToast('Pago realizado', 'El pago se ha realizado correctamente.');
      enrollment.paymentStatus = 'COMPLETED';
    })
    .catch((e: any) => {
      showError('Error', e.message || 'No se pudo procesar el pago.');
    });
}

function handleEnter(enrollment: any) {
  console.log('Enrollment recibido en handleEnter:', enrollment);
  
  // Verificar si el ID existe y es un número válido
  const courseId = enrollment.courseId;
  console.log('ID del curso:', courseId);
  
  if (!courseId || isNaN(Number(courseId))) {
    showError('Error', 'ID de curso inválido');
    return;
  }
  
  showToast('Entrando al curso', `Entrando a: ${enrollment.courseName || 'Curso'}`);
  router.push(`/student/course/${courseId}`);
}
</script>
