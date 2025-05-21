<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Examen Iniciado</h2>
    
    <div v-if="examData">
      <div class="mb-6 p-4 bg-[#212121] rounded-md">
        <h3 class="text-xl font-bold mb-2">{{ examData.examTitle }}</h3>
        <p class="mb-2"><span class="font-semibold">ID del examen:</span> {{ examData.examId }}</p>
        <p class="mb-2"><span class="font-semibold">Tiempo límite:</span> {{ examData.timeLimit }} minutos</p>
        <p class="mb-2"><span class="font-semibold">Preguntas totales:</span> {{ examData.totalQuestions }}</p>
        <p class="mb-2"><span class="font-semibold">Fecha de inicio:</span> {{ formatDate(examData.startTime) }}</p>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-bold mb-3">Datos completos recibidos:</h3>
        <pre class="bg-[#212121] p-4 rounded-md overflow-auto text-sm">{{ JSON.stringify(examData, null, 2) }}</pre>
      </div>
      
      <button 
        @click="$emit('finish')" 
        class="py-2 px-4 bg-slate-700 hover:bg-slate-800 text-white rounded"
      >
        Finalizar Vista de Datos
      </button>
    </div>
    <div v-else>
      <p class="text-center text-lg text-gray-400">No hay datos del examen disponibles.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  examData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['finish']);

// Función para formatear fecha
function formatDate(dateString: string): string {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
}
</script>