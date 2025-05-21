<template>
  <div class="bg-[#212121] p-6 rounded-md mb-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-semibold">Pregunta {{ questionNumber }}</h3>
      <span class="text-sm text-gray-400">{{ points }} puntos</span>
    </div>
    
    <p class="text-lg mb-6">{{ question.text }}</p>
    
    <div class="space-y-3">
      <div 
        v-for="option in question.options" 
        :key="option.id" 
        class="flex items-center p-3 border border-gray-700 rounded-md hover:bg-[#2a2a2a] cursor-pointer"
        :class="{ 'bg-[#2a2a2a] border-vue-green': selectedOption === option.id }"
        @click="selectOption(option.id)"
      >
        <div class="w-6 h-6 flex-shrink-0 mr-3 rounded-full border-2" 
          :class="selectedOption === option.id ? 'border-vue-green bg-vue-green' : 'border-gray-600'"
        ></div>
        <span>{{ option.text }}</span>
      </div>
    </div>
    
    <div class="flex justify-between mt-6">
      <button 
        v-if="questionNumber > 1"
        @click="$emit('previous')" 
        class="py-2 px-4 bg-slate-700 hover:bg-slate-800 text-white rounded"
      >
        Anterior
      </button>
      <div v-else></div>
      
      <button 
        v-if="questionNumber < totalQuestions"
        @click="$emit('next')" 
        class="py-2 px-4 bg-vue-green hover:bg-green-600 text-white rounded"
      >
        Siguiente
      </button>
      <button 
        v-else
        @click="$emit('finish')" 
        class="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Finalizar examen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Question } from '@/models/Exam.model';

const props = defineProps({
  question: {
    type: Object as () => Question,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  initialAnswer: {
    type: Number,
    default: undefined
  },
  points: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:answer', 'next', 'previous', 'finish']);

const selectedOption = ref<number | undefined>(props.initialAnswer);

watch(() => props.initialAnswer, (newVal) => {
  selectedOption.value = newVal;
});

watch(() => props.question, () => {
  selectedOption.value = props.initialAnswer;
});

function selectOption(optionId: number) {
  selectedOption.value = optionId;
  emit('update:answer', {
    questionId: props.question.id,
    selectedOptionId: optionId
  });
}
</script>
