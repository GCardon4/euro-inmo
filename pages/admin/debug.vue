<template>
  <div class="admin-layout">
    <div class="debug-container">
      <h1>🔍 Debug Panel - Propiedades y Filtros</h1>
      
      <div class="debug-section">
        <h2>Información de Base de Datos</h2>
        <button @click="loadDebugInfo" class="btn-debug">
          {{ loading ? 'Cargando...' : 'Cargar Información' }}
        </button>
      </div>

      <div v-if="debugInfo" class="debug-info">
        <div class="info-card">
          <h3>Resumen</h3>
          <p><strong>Total propiedades:</strong> {{ debugInfo.summary.totalProperties }}</p>
          <p><strong>Categorías disponibles:</strong> {{ debugInfo.summary.availableCategories.join(', ') }}</p>
        </div>

        <div class="info-card">
          <h3>Propiedades por Categoría</h3>
          <pre>{{ JSON.stringify(debugInfo.summary.propertiesByCategory, null, 2) }}</pre>
        </div>

        <div class="info-card">
          <h3>Primeras 10 Propiedades</h3>
          <table class="debug-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in debugInfo.properties.slice(0, 10)" :key="prop.id">
                <td>{{ prop.code }}</td>
                <td>{{ prop.name }}</td>
                <td>{{ prop.category?.name || '❌ SIN CATEGORÍA' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="info-card">
          <h3>Todas las Categorías en BD</h3>
          <table class="debug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in debugInfo.categories" :key="cat.id">
                <td>{{ cat.id }}</td>
                <td>{{ cat.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="debugError" class="error-message">
        <p>❌ {{ debugError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Composable para debug
const { checkPropertiesData } = usePropertiesDebug()

const debugInfo = ref(null)
const debugError = ref(null)
const loading = ref(false)

// Cargar información de debug
const loadDebugInfo = async () => {
  loading.value = true
  debugError.value = null
  
  const result = await checkPropertiesData()
  
  if (result) {
    debugInfo.value = result
  } else {
    debugError.value = 'Error al cargar la información de debug'
  }
  
  loading.value = false
}

// SEO
useSeoMeta({
  title: 'Debug Panel - EuroInmobiliaria',
  robots: 'noindex, nofollow'
})

// Auto-load en mount
onMounted(() => {
  loadDebugInfo()
})
</script>

<style scoped>
.debug-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #0b6182;
  margin-bottom: 2rem;
}

.debug-section {
  margin-bottom: 2rem;
}

.btn-debug {
  padding: 0.75rem 1.5rem;
  background: #0b6182;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-debug:hover {
  background: #082f3d;
}

.debug-info {
  display: grid;
  gap: 2rem;
}

.info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  color: #0b6182;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 2px solid #0b6182;
  padding-bottom: 0.5rem;
}

.info-card p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.info-card pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.debug-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.debug-table th {
  background: #f3f4f6;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #d1d5db;
  font-weight: 600;
}

.debug-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.debug-table tr:hover {
  background: #f9fafb;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #c00;
}
</style>
