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
          @click="applyQuickFilter(filter.value)"
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

      <div v-else-if="properties.length > 0" class="properties-grid">
        <PropertyCard
          v-for="property in properties"
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

      <!-- Botón cargar más (paginación real desde Supabase) -->
      <div v-if="hasMore" class="load-more">
        <button
          class="btn-load-more"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span v-if="loadingMore">Cargando...</span>
          <span v-else>Ver más propiedades ({{ properties.length }} de {{ totalCount }})</span>
        </button>
      </div>


    </div>
  </section>

   <NuxtLink class="fab-home" to="/" >
      <span class="material-icons">home</span>
    </NuxtLink>


</template>

<script setup>
// Tamaño de cada lote de propiedades traído desde Supabase
const PAGE_SIZE = 12

// Filtro rápido de categoría (sincronizado con la URL)
const selectedFilter = ref('all')

// IMPORTANTE: composables fuera de useAsyncData para evitar "nuxt instance unavailable"
const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

// Estado de propiedades y paginación real
const properties = ref([])
const totalCount = ref(0)
const loadingMore = ref(false)
const currentOffset = ref(0)
const quickFilters = ref([])

// Convertir texto a Title Case para comparar con nombres en la BD
const toTitleCase = (str) => str ? str.replace(/\b\w/g, c => c.toUpperCase()) : ''

// Construir query de Supabase con filtros activos desde URL y rango de paginación
const buildQuery = (offset = 0) => {
  let query = supabase
    .from('properties')
    .select(`
      id,
      code,
      name,
      description,
      price,
      rooms,
      bathrooms,
      area,
      kitchen,
      hall,
      dining,
      closet,
      clothing,
      gas,
      dressing,
      category!inner(name),
      status!inner(name),
      city!inner(id, name),
      zone(name)
    `, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  // Filtrar por estado (venta/arriendo)
  const statusFilter = route.query.status
  if (statusFilter) {
    const statusMap = { venta: 'Venta', arriendo: 'Arriendo', proyectos: 'Proyectos' }
    query = query.eq('status.name', statusMap[statusFilter.toLowerCase()] || toTitleCase(statusFilter))
  }

  // Filtrar por categoría (la URL guarda el nombre en minúsculas)
  const categoryFilter = route.query.categoryId
  if (categoryFilter) {
    query = query.eq('category.name', toTitleCase(categoryFilter.toLowerCase()))
  }

  // Filtrar por ciudad
  const cityFilter = route.query.cityId
  if (cityFilter) {
    query = query.eq('city_id', cityFilter)
  }

  // Filtrar por código de propiedad (búsqueda parcial)
  const codeFilter = route.query.code
  if (codeFilter) {
    query = query.ilike('code', `%${codeFilter}%`)
  }

  // Filtrar por rango de precio
  const minPrice = route.query.minPrice ? parseInt(route.query.minPrice) : null
  if (minPrice) query = query.gte('price', minPrice)

  const maxPrice = route.query.maxPrice ? parseInt(route.query.maxPrice) : null
  if (maxPrice) query = query.lte('price', maxPrice)

  return query
}

// Mapear propiedades al formato del componente e incluir imagen principal
const mapWithImages = async (data) => {
  if (!data || data.length === 0) return []

  const propertyIds = data.map(p => p.id)
  const { data: allImages } = await supabase
    .from('properties_images')
    .select('property_id, url_image')
    .in('property_id', propertyIds)
    .eq('main', true)

  const imageMap = {}
  if (allImages) {
    allImages.forEach(img => { imageMap[img.property_id] = img.url_image })
  }

  return data.map(prop => ({
    id: prop.id,
    code: prop.code,
    name: prop.name,
    category: prop.category?.name || 'Sin categoría',
    status: prop.status?.name || 'Disponible',
    cityId: prop.city?.id || null,
    location: prop.zone ? `${prop.zone.name}, ${prop.city.name}` : (prop.city?.name || 'Sin ubicación'),
    price: prop.price,
    bedrooms: prop.rooms,
    bathrooms: prop.bathrooms,
    area: prop.area,
    kitchen: prop.kitchen,
    hall: prop.hall,
    dining: prop.dining,
    closet: prop.closet,
    clothing: prop.clothing,
    gas: prop.gas,
    dressing: prop.dressing,
    imageUrl: imageMap[prop.id] || '/property-img.jpg'
  }))
}

// Carga inicial con soporte SSR — se refresca cuando cambian los filtros de la URL
const { data: initialData, pending, error: fetchError, refresh } = await useAsyncData(
  'featured-properties',
  async () => {
    if (!config.public.supabase?.url || !config.public.supabase?.key) {
      return { properties: [], total: 0 }
    }

    const { data, error: supabaseError, count } = await buildQuery(0)

    if (supabaseError) {
      console.error('❌ Error de Supabase:', supabaseError)
      throw new Error('No se pudieron cargar las propiedades')
    }

    const mapped = await mapWithImages(data)
    console.log(`✅ Propiedades cargadas: ${mapped.length} de ${count} total`)
    return { properties: mapped, total: count || 0 }
  },
  { default: () => ({ properties: [], total: 0 }) }
)

// Sincronizar estado al cargar o al cambiar filtros (resetea la lista)
watch(initialData, (newData) => {
  if (newData) {
    properties.value = newData.properties || []
    totalCount.value = newData.total || 0
    currentOffset.value = (newData.properties || []).length
  }
}, { immediate: true })

const loading = computed(() => pending.value)
const error = computed(() => fetchError.value ? 'Error al cargar propiedades' : null)

// Indica si quedan más propiedades por cargar en Supabase
const hasMore = computed(() => properties.value.length < totalCount.value)

// Cargar el siguiente lote de propiedades desde Supabase
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const { data, error: supabaseError } = await buildQuery(currentOffset.value)
    if (supabaseError) throw supabaseError
    if (data && data.length > 0) {
      const mapped = await mapWithImages(data)
      properties.value = [...properties.value, ...mapped]
      currentOffset.value += data.length
    }
  } catch (err) {
    console.error('❌ Error al cargar más propiedades:', err)
  } finally {
    loadingMore.value = false
  }
}

// Obtener icono según categoría
const getCategoryIcon = (categoryName) => {
  const icons = {
    'apartamento': 'apartment', 'apartamentos': 'apartment',
    'casa': 'home', 'casas': 'home',
    'finca': 'landscape', 'fincas': 'landscape',
    'lote': 'grid_on', 'lotes': 'grid_on',
    'local': 'store', 'locales': 'store'
  }
  return icons[categoryName] || 'home_work'
}

// Cargar categorías de Supabase para los filtros rápidos
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

    const categoryFilters = (categories || []).map(cat => ({
      label: cat.name,
      value: cat.name.toLowerCase().trim(),
      icon: getCategoryIcon(cat.name.toLowerCase())
    }))

    quickFilters.value = [
      { label: 'Todas', value: 'all', icon: 'home_work' },
      ...categoryFilters
    ]

    return categoryFilters
  } catch (err) {
    console.error('❌ Error en loadCategories:', err)
    return []
  }
}

// Aplicar filtro rápido de categoría actualizando la URL (dispara nueva carga)
const applyQuickFilter = (value) => {
  selectedFilter.value = value
  const newQuery = { ...route.query }
  if (value === 'all') {
    delete newQuery.categoryId
  } else {
    newQuery.categoryId = value
  }
  router.push({ query: newQuery })
}

onMounted(async () => {
  const loadedFilters = await loadCategories()
  if (loadedFilters.length === 0) {
    quickFilters.value = [
      { label: 'Todas', value: 'all', icon: 'home_work' },
      { label: 'Apartamentos', value: 'apartamento', icon: 'apartment' },
      { label: 'Casas', value: 'casa', icon: 'home' },
      { label: 'Fincas', value: 'finca', icon: 'landscape' },
      { label: 'Lotes', value: 'lote', icon: 'grid_on' }
    ]
  }

  // Sincronizar filtro activo desde la URL
  if (route.query.categoryId) {
    selectedFilter.value = route.query.categoryId
  }
})

// Sincronizar selectedFilter cuando la categoría cambia desde la URL
watch(() => route.query.categoryId, (newVal) => {
  selectedFilter.value = newVal || 'all'
})

// Re-cargar desde Supabase cuando cambie cualquier filtro de la URL
watch(() => route.query, () => {
  refresh()
}, { deep: true })
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

.fab-home {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  
  width: 48px;
  height: 48px;
  
  background-color: #0b6182;
  color: #ffffff;
  
  border: none;
  border-radius: 50%;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  
  transition: all 0.2s ease-in-out;
  z-index: 9999;
}

.fab-home:hover {
  transform: translateX(-50%) scale(1.08);
  background-color: #1565c0;
}

.fab-home:active {
  transform: translateX(-50%) scale(0.95);
}

/* Tamaño del ícono (no mayor a 20px) */
.fab-home .material-icons {
  font-size: 20px;
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
