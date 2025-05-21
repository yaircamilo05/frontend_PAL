<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md">
    <div v-if="loading">
      <p class="text-center text-lg text-gray-400">Cargando examen...</p>
      <div class="flex justify-center mt-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
    <div v-else-if="error">
      <div class="text-center py-8">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <p class="text-gray-400 mt-2">Por favor, inténtalo de nuevo más tarde.</p>
        <button 
          @click="$emit('cancel')" 
          class="mt-4 py-2 px-4 bg-slate-700 hover:bg-slate-800 text-white rounded"
        >
          Volver
        </button>
      </div>
    </div>
    <div v-else class="text-center">
      <h2 class="text-2xl font-bold mb-4">{{ examName }}</h2>
      
      <div class="bg-[#212121] p-6 rounded-md mb-6 max-w-md mx-auto text-left">
        <p class="mb-2"><span class="font-semibold">Duración:</span> {{ examTimeLimit }} minutos</p>
        <p class="mb-2"><span class="font-semibold">Puntaje máximo:</span> {{ maxScore }} puntos</p>
        <p class="mb-2"><span class="font-semibold">Puntaje para aprobar:</span> {{ passingScore }} puntos</p>
        <p class="text-yellow-400 mt-4 font-medium">
          Una vez iniciado el examen, deberás completarlo sin salir. ¿Estás listo para comenzar?
        </p>
      </div>
      
      <div class="flex justify-center space-x-4">
        <button 
          @click="startExamAction" 
          class="py-3 px-6 bg-vue-green hover:bg-green-600 text-white font-medium rounded-md"
          :disabled="startingExam"
        >
          {{ startingExam ? 'Iniciando...' : 'Comenzar Examen' }}
        </button>
        <button 
          @click="$emit('cancel')" 
          class="py-3 px-6 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-md"
          :disabled="startingExam"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { startExam } from '@/services/api';
import { success, error as showError } from '@/composables/alerts';

const props = defineProps({
  examId: {
    type: Number,
    required: true
  },
  examName: {
    type: String,
    required: true
  },
  examTimeLimit: {
    type: Number,
    default: 60
  },
  maxScore: {
    type: Number,
    default: 100
  },
  passingScore: {
    type: Number,
    default: 60
  }
});

const emit = defineEmits(['start', 'cancel']);
const { showToast } = success();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const startingExam = ref<boolean>(false);

const startExamAction = async () => {
  startingExam.value = true;
  error.value = null;
  
  try {
    // Get user info from session storage
    const userInfoString = sessionStorage.getItem('userInfo');
    if (!userInfoString) {
      throw new Error('No se encontró información del usuario.');
    }
    
    const userInfo = JSON.parse(userInfoString);
    const userId = userInfo.id;
    
    if (!userId) {
      throw new Error('No se encontró el ID del usuario.');
    }
    
    console.log(`Starting exam ${props.examId} for user ${userId}`);
    const { data } = await startExam(props.examId, userId);
    
    console.log('Exam started successfully:', data);
    showToast('Examen iniciado', 'Has comenzado el examen correctamente.');
    emit('start', data);
  } catch (e: any) {
    console.error('Error starting exam:', e);
    let errorMessage = 'Error al iniciar el examen.';
    
    if (e.response?.data) {
      if (typeof e.response.data === 'string') {
        errorMessage = e.response.data;
      } else if ('message' in e.response.data) {
        errorMessage = e.response.data.message;
      }
    } else if (e.message) {
      errorMessage = e.message;
    }
    
    error.value = errorMessage;
  } finally {
    startingExam.value = false;
  }
};

defineExpose({
  startExam: startExamAction
});
</script>
