<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const token = route.query.token as string

  if (token) {
    // Decodificar el JWT para extraer la información del usuario
    const payload = JSON.parse(atob(token.split('.')[1]))

    const userInfo = {
      id: payload.id,
      username: payload.sub,
      roles: payload.roles,
      token: token
    }

    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))

    // Redireccionar al home o a donde necesites
    if (userInfo.roles.includes('ADMIN')) {
      router.push('/admin/courses')
    } else if (userInfo.roles.includes('student')) {
      router.push('/student/courses')
    } else if (userInfo.roles.includes('INSTRUCTOR')) {
      router.push('/instructor/courses')
    } else {
      router.push('/') // Por si acaso
    }
  } else {
    // Si no hay token, redirige al login
    router.push('/login')
  }
})
</script>

<template>
  <p>Procesando login con Google...</p>
</template>
