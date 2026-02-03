// Middleware para proteger rutas de admin
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Solo ejecutar en cliente para evitar errores de SSR con Supabase
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const supabase = useSupabaseClient()
  const config = useRuntimeConfig()

  // Inicializar autenticación si no está inicializada
  if (!authStore.user) {
    await authStore.initAuth(supabase, config)
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
