<template>
  <div class="bg-[#1c1c1c] p-6 rounded-lg shadow-md max-w-3xl mx-auto">
    <!-- Header: Title and Timer -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-white">{{ examData.examTitle }}</h2>
      <div class="text-lg font-mono text-red-400">{{ formattedTimeLeft }}</div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-gray-600 h-2 rounded mb-6">
      <div
        class="bg-green-500 h-2 rounded"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <!-- Question Card -->
    <div class="bg-[#212121] p-6 rounded-md">
      <p class="mb-2 font-semibold text-gray-300">
        Pregunta {{ currentQuestionIndex + 1 }} de {{ examData.totalQuestions }}
      </p>
      <p class="mb-4 text-white leading-relaxed">
        {{ currentQuestion.text }}
      </p>

      <!-- Multiple Choice Questions -->
      <div v-if="currentQuestion.type === 'MULTIPLE_CHOICE'" class="space-y-3">
        <label
          v-for="option in currentQuestion.options"
          :key="option.id"
          class="flex items-center p-3 rounded-md hover:bg-[#2a2a2a] cursor-pointer transition-colors duration-200"
          :class="{'bg-[#2a2a2a]': answers[currentQuestionIndex] === option.text}"
        >
          <input
            type="radio"
            :value="option.text"
            v-model="answers[currentQuestionIndex]"
            class="form-radio text-green-400 mr-3"
          />
          <span class="text-gray-200">{{ option.text }}</span>
        </label>
      </div>

      <!-- Short Answer Questions -->
      <div v-else-if="currentQuestion.type === 'SHORT_ANSWER'" class="mt-4">
        <textarea
          v-model="answers[currentQuestionIndex]"
          rows="4"
          class="w-full bg-[#2a2a2a] text-white p-3 rounded-md border border-gray-700 focus:border-green-500 focus:outline-none"
          placeholder="Escribe tu respuesta aquí..."
        ></textarea>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="mt-6 flex justify-between">
      <button
        @click="prevQuestion"
        :disabled="currentQuestionIndex === 0"
        class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded disabled:opacity-50 transition-colors duration-200"
      >
        Anterior
      </button>

      <div class="flex-1 text-center text-gray-400">
        {{ currentQuestionIndex + 1 }} / {{ examData.totalQuestions }}
      </div>

      <button
        v-if="!isLastQuestion"
        @click="nextQuestion"
        :disabled="!answers[currentQuestionIndex]"
        class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded disabled:opacity-50 transition-colors duration-200"
      >
        Siguiente
      </button>

      <button
        v-else
        @click="submitExam"
        :disabled="!answers[currentQuestionIndex]"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50 transition-colors duration-200"
      >
        Finalizar Examen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

// Interface for option
interface Option {
  id: number;
  text: string;
  isCorrect: boolean | null;
}

// Interface for question
interface Question {
  id: number;
  text: string;
  points: number;
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';
  correctAnswer: string | null;
  options: Option[] | null;
}

// Interface for exam data
interface ExamData {
  id: number;
  examId: number;
  examTitle: string;
  startTime: string;
  timeLimit: number;
  totalQuestions: number;
  questions: Question[];
}

interface AnswerSubmission{
  questionId: number;
  selectedOptionId?: number | null;
  textAnswer?: string | null;
}

// Props
const props = defineProps<{ 
  examData: ExamData
}>();

// Define emits with payload type
const emit = defineEmits<{
  (event: 'submit', payload: { answers: AnswerSubmission[], examId: number, userId: number }): void;
}>();

// State
const currentQuestionIndex = ref(0);
const answers = reactive<string[]>(Array(props.examData.totalQuestions).fill(''));
const userId = ref<number>(parseInt(JSON.parse(sessionStorage.getItem('userInfo') || '{}').id || '0'));

// Computed
const isLastQuestion = computed(() => currentQuestionIndex.value === props.examData.totalQuestions - 1);
const currentQuestion = computed(() => props.examData.questions[currentQuestionIndex.value]);
const progress = computed(() => ((currentQuestionIndex.value + 1) / props.examData.totalQuestions) * 100);

// Navigation
function nextQuestion() {
  if (!isLastQuestion.value) currentQuestionIndex.value++;
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value--;
}

function submitExam() {
  // Transformar el array de respuestas al formato requerido por la API
  const formattedAnswers = answers.map((answer, index) => {
    const question = props.examData.questions[index];
    
    // Si es pregunta de opción múltiple, buscar el ID de la opción seleccionada
    if (question.type === 'MULTIPLE_CHOICE' && question.options) {
      const selectedOption = question.options.find(opt => opt.text === answer);
      return {
        questionId: question.id,
        selectedOptionId: selectedOption ? selectedOption.id : null
      };
    } 
    // Si es pregunta de respuesta corta
    else if (question.type === 'SHORT_ANSWER') {
      return {
        questionId: question.id,
        textAnswer: answer
      };
    }
    
    return null;
  }).filter(item => item !== null);
  
  // Emitir el evento con el formato correcto para la API
  emit('submit', { 
    answers: formattedAnswers,
    examId: props.examData.examId,
    userId: userId.value
  });

  console.log('Enviando respuestas al servidor:', { 
    answers: formattedAnswers,
    examId: props.examData.examId,
    userId: userId.value
  });
}

// Timer Logic
const timeLeft = ref(0);
let timerId: number;
const endTime = new Date(props.examData.startTime).getTime() + props.examData.timeLimit * 60000;

function updateTimer() {
  const now = Date.now();
  timeLeft.value = Math.max(0, Math.ceil((endTime - now) / 1000));
  // Comentado: Si el tiempo llega a cero, envía automáticamente el examen
  if (timeLeft.value === 0) submitExam();
}

const formattedTimeLeft = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

onMounted(() => {
  updateTimer();
  timerId = window.setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timerId);
});
</script>

<style scoped>
.form-radio {
  border-radius: 50%;
  width: 1.2em;
  height: 1.2em;
  border: 2px solid #4b5563;
  appearance: none;
  outline: none;
  cursor: pointer;
}

.form-radio:checked {
  background-color: #10b981;
  border-color: #10b981;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Better focus styles for keyboard navigation */
:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}
</style>