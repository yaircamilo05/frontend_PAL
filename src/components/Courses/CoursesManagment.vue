<template>
  <slot :instructors="instructors" :categories="categories"></slot>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const instructors = ref([]);
const categories = ref([]);

const fetchData = async () => {
};

onMounted(fetchData);
</script>
