// Plugin para inicializar Pinia correctamente en SSR
export default defineNuxtPlugin(() => {
  // Asegurar que Pinia esté disponible tanto en cliente como servidor
  const pinia = usePinia()
  
  if (process.server) {
    // En servidor, crear una nueva instancia de pinia por cada request
    return {
      provide: {
        pinia
      }
    }
  }
})
