// Plugin para inicializar Supabase de forma segura
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Verificar que las variables de entorno estén configuradas
  if (import.meta.client) {
    if (!config.public.supabaseUrl) {
      console.warn('⚠️  SUPABASE_URL no está configurada')
    }
    if (!config.public.supabaseKey) {
      console.warn('⚠️  SUPABASE_KEY no está configurada')
    }
  }
})
