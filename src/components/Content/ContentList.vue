<template>
    <ul class="mt-4">
        <li v-for="content in localContent" :key="content.id" class="border-b py-2 flex justify-between items-center">
            <div>
                <a :href="content.url" target="_blank" class="text-blue-500 underline">
                    {{ content.type }}
                    <img :src="content.url" alt="Imagen" class="w-32 h-32 object-cover rounded-lg" />
                </a>
            </div>
            <button @click="handleDeleteContent(content.id)" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
        </li>
    </ul>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '@/services/api';
import { success, error, confirmation } from '../../composables/alerts.ts';

const props = defineProps({
    content: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['delete', 'course-deleted']);
const localContent = ref([...props.content]);
const { showToast } = success();
const { showError } = error();
const { confirmDeletion } = confirmation();

watch(() => props.content, (newContent) => {
    localContent.value = [...newContent];
}, { deep: true });

const handleDeleteContent = async (contentId) => {
    const result = await confirmDeletion();
    if (result.isConfirmed) {
        try {
            await api.delete(`/content/delete/${contentId}`);
            localContent.value = localContent.value.filter(content => content.id !== contentId);
            emit('course-deleted', contentId);
            showToast('Contenido eliminado!', 'El contenido ha sido eliminado correctamente.');
        } catch (error) {
            console.error('Error al eliminar el contenido:', error);
            showError('Error', 'No se pudo eliminar el contenido.');
        }
    }
};
</script>
