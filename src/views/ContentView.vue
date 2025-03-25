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
 
 const fetchContent = async () => {
     try {
         const response = await api.get('/content/all');
         content.value = response.data;
     } catch (error) {
         console.error('Error al cargar contenidos:', error);
         Swal.fire({ 
             icon: 'error', 
             title: 'Error', 
             text: 'No se pudieron cargar los contenidos: ' + error.message 
         });
     }
 };
 
 const uploadContent = async (contentData) => {
  try {
    // Crea un FormData para enviar los datos
    const formData = new FormData();
    formData.append('file', contentData.file);
    formData.append('courseId', contentData.courseId);
    
    const response = await api.post('/content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('Respuesta del servidor:', response);
    content.value.push(response.data);
    
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Contenido cargado correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error al cargar contenido:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cargar el contenido: ' + (error.response?.data?.message || error.message)
    });
  }
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
    // Primero, verificar que contentId es válido
    if (!contentId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ID de contenido no válido'
      });
      return;
    }

    // Realizar la solicitud de eliminación
    const response = await api.delete(`/content/${contentId}`);

    // Actualizar la lista de contenidos localmente
    content.value = content.value.filter(content => content.id !== contentId);

    Swal.fire({
      title: '¡Eliminado!',
      text: 'El contenido ha sido eliminado.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error al eliminar contenido:', error);
    
    // Mostrar detalles más específicos del error
    const errorMessage = error.response?.data?.message || 
                         error.response?.data || 
                         error.message || 
                         'Error desconocido';

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `No se pudo eliminar el contenido: ${errorMessage}`,
      footer: `Código de estado: ${error.response?.status || 'N/A'}`
    });
  }
};
 
 onMounted(fetchContent);
 </script>