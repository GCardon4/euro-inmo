// Plugin para inicializar autenticación al cargar la app (solo cliente)
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const supabase = useSupabaseClient()
  const config = useRuntimeConfig()

  // Inicializar autenticación con los composables del contexto del plugin
  await authStore.initAuth(supabase, config)
})
