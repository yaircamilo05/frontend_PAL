<template>
    <div class="contenedor_general">
      <h1 class="text-3xl font-bold mb-10">Gestión de Contenido</h1>
  
      <div class="contenedor_interno">
        <h2 class="text-xl font-semibold mb-6">Cargar Contenido</h2>
        <ContentForm :isCreateMode="true" @submit="uploadContent" />
      </div>
  
      <div class="contenedor_interno">
        <ContentList 
          :content="content" 
          @edit="startEdit" 
          @delete="confirmDeleteContent" 
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  import api from '@/services/api';
  import ContentForm from '@/components/Content/ContentForm.vue';
  import ContentList from '@/components/Content/ContentList.vue';
  
  const content = ref([]);
  const newContent = ref({ username: '', password: '' });
  
  const fetchContent = async () => {
  try {
    const response = await api.get('/content/all');
    content.value = response.data;
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los contenidos.' });
  }
  };
  
  const uploadContent = async (contentData) => {
  try {
    const response = await api.post('/content/update', contentData);
    content.value.push(response.data);
    Swal.fire({ icon: 'success', title: '¡Éxito!', text: 'Contenido cargado correctamente.', timer: 1500, showConfirmButton: false });
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar el contenido.' });
  }
  };
  
  const startEdit = (content) => {
  // Implementar la lógica para comenzar a editar un usuario
  console.log('Editar contenido:', content);
  // Por ejemplo, podrías abrir un modal o cambiar a un modo de edición
  };
  
  const confirmDeleteContent = (contentId) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede revertir',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteContent(contentId);
    }
  });
  };
  
  const deleteContent = async (contentId) => {
  try {
    await api.delete(`/users/${contentId}`);
    content.value = content.value.filter(content => content.id !== contentId);
    Swal.fire({
      title: '¡Eliminado!',
      text: 'El contenido ha sido eliminado.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el contenido.'
    });
  }
  };
  
  onMounted(fetchContent);
  </script>