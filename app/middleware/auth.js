// Middleware para proteger rutas de admin
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticación si no está inicializada
  if (!authStore.user) {
    await authStore.initAuth()
  }

  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Si está autenticado pero no es admin ni asesor, redirigir a home
  if (!authStore.isAdmin && !authStore.isAsesor) {
    return navigateTo('/')
  }
})
