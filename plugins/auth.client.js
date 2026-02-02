// Plugin para inicializar autenticación al cargar la app
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Inicializar autenticación
  await authStore.initAuth()
})
