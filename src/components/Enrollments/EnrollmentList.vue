<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-6">Mis Inscripciones</h2>
    <div v-if="enrollments.length === 0" class="text-vue-gray-light">
      No tienes inscripciones.
    </div>
    <ul v-else class="space-y-6">
      <li v-for="enrollment in enrollments" :key="enrollment.courdId" class="flex flex-col p-3.5 m-3 bg-[#212121] rounded-md">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-semibold">{{ enrollment.courseName || 'Curso desconocido' }}</h3>
          <div class="flex items-center gap-4">
            <button
              :disabled="enrollment.paymentStatus === 'COMPLETED'"
              @click="$emit('pay', enrollment)"
              class="inline-flex items-center justify-center px-4 py-2 border-2 rounded-md"
              :class="enrollment.paymentStatus === 'COMPLETED' ? 'text-gray-400 border-gray-400 bg-gray-800 cursor-not-allowed' : 'text-green-500 border-green-500 hover:text-green-700'"
            >
              {{ enrollment.paymentStatus === 'COMPLETED' ? 'Pagado' : 'Pagar' }}
            </button>
            <button
              :disabled="enrollment.paymentStatus !== 'COMPLETED'"
              @click="$emit('enter', enrollment)"
              class="inline-flex items-center justify-center px-4 py-2 border-2 rounded-md"
              :class="enrollment.paymentStatus === 'COMPLETED' ? 'text-blue-500 border-blue-500 hover:text-blue-700' : 'text-gray-400 border-gray-400 bg-gray-800 cursor-not-allowed'"
            >
              Entrar al curso
            </button>
          </div>
        </div>
        <div class="flex gap-4 mt-2">
          <span class="text-gray-400">Estado de pago: <strong>{{ paymentStatusLabel(enrollment.paymentStatus) }}</strong></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Enrollment } from '@/models/Enrollment.model';

defineProps<{ enrollments: Enrollment[] }>();
defineEmits(['pay', 'enter']);

function paymentStatusLabel(status: string) {
  switch (status) {
    case 'COMPLETED': return 'Pagado';
    case 'PENDING': return 'Pendiente';
    case 'FAILED': return 'Rechazado';
    case 'CANCELLED': return 'Cancelado';
    default: return status;
  }
}
</script>
