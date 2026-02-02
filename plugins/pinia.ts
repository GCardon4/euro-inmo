// Plugin para inicializar Pinia correctamente en SSR
export default defineNuxtPlugin((nuxtApp) => {
  // En SSR, asegurar que cada request tenga su propia instancia de stores
  if (process.server) {
    nuxtApp.hook('app:rendered', () => {
      // Limpiar stores después de cada render en servidor
      const pinia = nuxtApp.$pinia
      if (pinia && pinia.state && pinia.state.value) {
        Object.keys(pinia.state.value).forEach(key => {
          delete pinia.state.value[key]
        })
      }
    })
  }
})
