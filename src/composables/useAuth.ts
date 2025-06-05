import { ref, computed } from 'vue'

interface User {
  id: number
  username: string
  roles: string[]
  fullName?: string
}

const user = ref<User | null>(null)
const isAuthenticated = ref(false)

const userRole = computed((): string | null => {
  if (!user.value || !user.value.roles?.length) return null
  return user.value.roles[0] // ← Tomamos el primer rol
})

const setUserFromSession = (): void => {
  try {
    const userInfo = sessionStorage.getItem('userInfo')
    const jwt = sessionStorage.getItem('jwt')

    if (userInfo && jwt) {
      user.value = { ...JSON.parse(userInfo) }
      isAuthenticated.value = true
    } else {
      user.value = null
      isAuthenticated.value = false
    }
  } catch (error) {
    console.error('❌ Error al cargar usuario:', error)
    user.value = null
    isAuthenticated.value = false
  }
}

const logout = (): void => {
  sessionStorage.removeItem('userInfo')
  sessionStorage.removeItem('jwt')
  user.value = null
  isAuthenticated.value = false
}

const hasRole = (role: string): boolean => {
  return user.value?.roles?.includes(role) ?? false
}

export {
  user,
  userRole,
  isAuthenticated,
  setUserFromSession,
  logout,
  hasRole
}
