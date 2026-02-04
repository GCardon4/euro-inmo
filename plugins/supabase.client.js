// Plugin para inicializar Supabase de forma segura
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Verificar que las variables de entorno estén configuradas
  if (import.meta.client) {
    if (!config.public.supabase?.url) {
      console.warn('⚠️  SUPABASE_URL no está configurada')
    }
    if (!config.public.supabase?.key) {
      console.warn('⚠️  SUPABASE_KEY no está configurada')
    }
  }
})
