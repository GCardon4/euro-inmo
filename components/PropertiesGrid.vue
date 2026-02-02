<template>
  <section class="properties-section">
    <div class="container">
      <!-- Título de la sección -->
      <div class="section-header">
        <h2 class="section-title">Propiedades Destacadas</h2>
        <p class="section-subtitle">
          Descubre las mejores opciones disponibles en el Oriente Antioqueño
        </p>
      </div>

      <!-- Filtros rápidos -->
      <div class="quick-filters">
        <button
          v-for="filter in quickFilters"
          :key="filter.value"
          class="quick-filter-btn"
          :class="{ active: selectedFilter === filter.value }"
          @click="selectedFilter = filter.value"
        >
          <span class="filter-icon">{{ filter.icon }}</span>
          <span>{{ filter.label }}</span>
        </button>
      </div>

      <!-- Grid de propiedades -->
      <div v-if="loading" class="loading-state">
        <span class="spinner">⏳</span>
        <p>Cargando propiedades...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <span class="error-icon">❌</span>
        <h3>Error al cargar propiedades</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="filteredProperties.length > 0" class="properties-grid">
        <PropertyCard
          v-for="property in displayedProperties"
          :key="property.id"
          :property="property"
        />
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <span class="empty-icon">🏠</span>
        <h3>No hay propiedades disponibles</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>

      <!-- Botón ver más -->
      <div v-if="filteredProperties.length > propertiesPerPage" class="load-more">
        <button
          v-if="displayedProperties.length < filteredProperties.length"
          class="btn-load-more"
          @click="loadMore"
        >
          Ver más propiedades
        </button>
      </div>

      <!-- Botón ver todas -->
      <div class="view-all">
        <NuxtLink to="/properties" class="btn-view-all">
          Ver todas las propiedades
          <span>→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// Filtros rápidos
const quickFilters = [
  { label: 'Todas', value: 'all', icon: '🏘️' },
  { label: 'Apartamentos', value: 'apartamento', icon: '🏢' },
  { label: 'Casas', value: 'casa', icon: '🏠' },
  { label: 'Fincas', value: 'finca', icon: '🌾' },
  { label: 'Lotes', value: 'lote', icon: '📐' }
]

// Estado de filtro seleccionado
const selectedFilter = ref('all')

// Propiedades por página
const propertiesPerPage = 6
const currentPage = ref(1)

// Cliente Supabase (sin requerir autenticación)
const config = useRuntimeConfig()
const supabase = useSupabaseClient()

// Cargar propiedades desde Supabase
const properties = ref([])
const loading = ref(true)
const error = ref(null)

const fetchProperties = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Verificar que las credenciales de Supabase estén disponibles
    if (!config.public.supabaseUrl || !config.public.supabaseKey) {
      throw new Error('Configuración de Supabase no disponible')
    }
    
    const { data, error: fetchError } = await supabase
      .from('properties')
      .select(`
        id,
        code,
        name,
        description,
        price,
        bedrooms,
        bathrooms,
        area,
        categorias!inner(name),
        status!inner(name),
        city!inner(name),
        zone(name)
      `)
      .order('created_at', { ascending: false })
      .limit(12)

    if (fetchError) {
      console.error('Error de Supabase:', fetchError)
      throw new Error(fetchError.message || 'Error al cargar propiedades')
    }
    
    if (!data || data.length === 0) {
      properties.value = []
      return
    }
    
    // Mapear datos al formato esperado
    properties.value = data.map(prop => ({
      id: prop.id,
      code: prop.code,
      name: prop.name,
      category: prop.categorias?.name || 'Sin categoría',
      status: prop.status?.name || 'Disponible',
      location: prop.zone ? `${prop.zone.name}, ${prop.city.name}` : (prop.city?.name || 'Sin ubicación'),
      price: prop.price,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area,
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' // Placeholder
    }))
  } catch (err) {
    error.value = err.message || 'Error desconocido al cargar propiedades'
    console.error('Error cargando propiedades:', err)
  } finally {
    loading.value = false
  }
}

// Cargar propiedades al montar el componente
onMounted(() => {
  fetchProperties()
})

// Propiedades filtradas
const filteredProperties = computed(() => {
  if (selectedFilter.value === 'all') {
    return properties.value
  }
  return properties.value.filter(
    p => p.category.toLowerCase() === selectedFilter.value
  )
})

// Propiedades mostradas según paginación
const displayedProperties = computed(() => {
  return filteredProperties.value.slice(0, currentPage.value * propertiesPerPage)
})

// Cargar más propiedades
const loadMore = () => {
  currentPage.value++
}

// Resetear paginación al cambiar filtro
watch(selectedFilter, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.properties-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 1rem 0;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
}

.quick-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.quick-filter-btn {
  padding: 0.875rem 1.75rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  font-weight: 600;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.quick-filter-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

.quick-filter-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.filter-icon {
  font-size: 1.25rem;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 5rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.spinner {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #dc2626;
}

.error-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.load-more {
  text-align: center;
  margin-bottom: 2rem;
}

.btn-load-more {
  padding: 1rem 2.5rem;
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-load-more:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-2px);
}

.view-all {
  text-align: center;
  margin-top: 3rem;
}

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 3rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-view-all:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .properties-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .properties-section {
    padding: 3rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .quick-filters {
    gap: 0.75rem;
  }

  .quick-filter-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }

  .properties-grid {
    grid-template-columns: 1fr;
  }
}
</style>
