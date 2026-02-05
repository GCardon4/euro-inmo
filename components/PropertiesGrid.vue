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
          <Icon :name="filter.icon" custom-class="filter-icon" />
          <span>{{ filter.label }}</span>
        </button>
      </div>

      <!-- Grid de propiedades -->
      <div v-if="loading" class="loading-state">
        <Icon name="refresh" custom-class="spinner" />
        <p>Cargando propiedades...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon name="error_outline" custom-class="error-icon" />
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
        <Icon name="home_work" custom-class="empty-icon" />
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
          <Icon name="arrow_forward" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// Estado de filtro seleccionado
const selectedFilter = ref('all')

// Propiedades por página
const propertiesPerPage = 6
const currentPage = ref(1)

// Cargar propiedades desde Supabase usando useAsyncData para SSR seguro
const properties = ref([])
const loading = ref(true)
const error = ref(null)
const quickFilters = ref([])

// IMPORTANTE: Obtener composables FUERA del callback de useAsyncData
// para evitar el error "nuxt instance unavailable"
const supabase = useSupabaseClient()
const config = useRuntimeConfig()
const route = useRoute()
const { parseURLFilters } = usePropertyFilters()

// Cargar categorías de Supabase
const loadCategories = async () => {
  try {
    const { data: categories, error: catError } = await supabase
      .from('category')
      .select('id, name')
      .order('name', { ascending: true })

    if (catError) {
      console.error('❌ Error al cargar categorías:', catError)
      return []
    }

    // Mapear categorías a filtros
    const categoryFilters = (categories || []).map(cat => ({
      label: cat.name,
      value: cat.name.toLowerCase().trim(),
      icon: getCategoryIcon(cat.name.toLowerCase())
    }))

    // Agregar filtro "Todas" al principio
    quickFilters.value = [
      { label: 'Todas', value: 'all', icon: 'home_work' },
      ...categoryFilters
    ]

    if (process.client) {
      console.log('✅ Categorías cargadas:', quickFilters.value.map(f => `${f.label} (${f.value})`))
    }

    return categoryFilters
  } catch (err) {
    console.error('❌ Error en loadCategories:', err)
    return []
  }
}

// Obtener icono según categoría
const getCategoryIcon = (categoryName) => {
  const icons = {
    'apartamento': 'apartment',
    'apartamentos': 'apartment',
    'casa': 'home',
    'casas': 'home',
    'finca': 'landscape',
    'fincas': 'landscape',
    'lote': 'grid_on',
    'lotes': 'grid_on',
    'local': 'store',
    'locales': 'store'
  }
  return icons[categoryName] || 'home_work'
}

// Cargar categorías al montar el componente
onMounted(async () => {
  const loadedFilters = await loadCategories()
  
  // Si no se cargaron categorías, usar valores por defecto
  if (loadedFilters.length === 0) {
    console.warn('⚠️ No se cargaron categorías, usando valores por defecto')
    quickFilters.value = [
      { label: 'Todas', value: 'all', icon: 'home_work' },
      { label: 'Apartamentos', value: 'apartamentos', icon: 'apartment' },
      { label: 'Casas', value: 'casas', icon: 'home' },
      { label: 'Fincas', value: 'fincas', icon: 'landscape' },
      { label: 'Lotes', value: 'lotes', icon: 'grid_on' }
    ]
  }
  
  // Aplicar filtros de URL si existen
  const urlFilters = parseURLFilters()
  if (urlFilters.selectedStatus) {
    // Si hay status en URL, el componente mostrará un filtro especial
    if (process.client) {
      console.log('🔍 Filtros desde URL aplicados:', urlFilters)
    }
  }
  
  // Si hay categoría en la URL, aplicar ese filtro
  if (urlFilters.selectedCategory) {
    selectedFilter.value = urlFilters.selectedCategory
  }
})


// Usar useAsyncData para cargar datos de forma segura en SSR
const { data: propertiesData, pending, error: fetchError } = await useAsyncData(
  'featured-properties',
  async () => {
    // Verificar que las credenciales de Supabase estén disponibles
    if (!config.public.supabase?.url || !config.public.supabase?.key) {
      console.warn('Configuración de Supabase no disponible')
      return []
    }

    const { data, error: supabaseError } = await supabase
      .from('properties')
      .select(`
        id,
        code,
        name,
        description,
        price,
        category!inner(name),
        status!inner(name),
        city!inner(name),
        zone(name)
      `)
      .order('created_at', { ascending: false })
      .limit(12)

    if (supabaseError) {
      console.error('❌ Error de Supabase:', supabaseError)
      throw new Error('No se pudieron cargar las propiedades')
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay propiedades en la base de datos')
      return []
    }

    console.log('✅ Propiedades cargadas:', data.length)
    console.log('✅ Categorías encontradas:', data.map(p => `${p.code} -> ${p.category?.name}`))

    // Obtener imagenes destacadas para cada propiedad
    const propertiesWithImages = await Promise.all(
      data.map(async (prop) => {
        const { data: imageData } = await supabase
          .from('properties_images')
          .select('url_image')
          .eq('property_id', prop.id)
          .eq('main', true)
          .single()

        return {
          id: prop.id,
          code: prop.code,
          name: prop.name,
          category: prop.category?.name || 'Sin categoría',
          status: prop.status?.name || 'Disponible',
          location: prop.zone ? `${prop.zone.name}, ${prop.city.name}` : (prop.city?.name || 'Sin ubicación'),
          price: prop.price,
          imageUrl: imageData?.url_image || '/property-img.jpg'
        }
      })
    )

    return propertiesWithImages
  },
  {
    default: () => []
  }
)

// Sincronizar los datos con las refs reactivas
watch(propertiesData, (newData) => {
  if (newData && newData.length > 0) {
    properties.value = newData
    console.log('✅ PropertiesGrid: Datos sincronizados -', newData.length, 'propiedades')
  }
}, { immediate: true })

watch(pending, (isPending) => {
  loading.value = isPending
}, { immediate: true })

watch(fetchError, (err) => {
  error.value = err ? 'Error al cargar propiedades' : null
  if (err) {
    console.error('❌ PropertiesGrid: Error -', err)
  }
}, { immediate: true })

// Propiedades filtradas
const filteredProperties = computed(() => {
  if (selectedFilter.value === 'all') {
    return properties.value
  }
  
  const filtered = properties.value.filter(prop => {
    const categoryName = prop.category.toLowerCase().trim()
    const filterValue = selectedFilter.value.toLowerCase().trim()
    return categoryName === filterValue
  })
  
  if (process.client) {
    console.log(`🔍 Filtro: "${selectedFilter.value}" -> ${filtered.length} propiedades`)
  }
  
  return filtered
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
  color: #1e1e1c;
  margin: 0 0 1rem 0;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #585857;
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
  border-color: #0b6182;
  color: #0b6182;
  transform: translateY(-2px);
}

.quick-filter-btn.active {
  background: #0b6182;
  color: white;
  border-color: #0b6182;
}

.filter-icon {
  font-size: 1.25rem;
  user-select: none;
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
  color: #82bad3;
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
  color: #0b6182;
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
  color: #dc2626;
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
  background: linear-gradient(135deg, #0b6182 0%, #082f3d 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(11, 97, 130, 0.3);
}

.btn-view-all:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(11, 97, 130, 0.4);
  background: linear-gradient(135deg, #0d7599 0%, #0b6182 100%);
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
