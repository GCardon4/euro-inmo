<template>
  <div class="properties-page">
    <ClientOnly>
      <TheHeader />
    </ClientOnly>
    
    <section class="page-header">
      <div class="container">
        <h1>Propiedades</h1>
        <p>Encuentra tu propiedad ideal en el Oriente Antioqueño</p>
        
        <!-- Mostrar filtros aplicados -->
        <div v-if="hasActiveFilters" class="active-filters">
          <span class="filter-badge">
            <Icon name="filter_list" custom-class="icon" />
            <span>Filtros activos:</span>
          </span>
          <div class="filters-list">
            <span v-if="activeFilters.status" class="filter-chip">
              {{ formatFilterLabel('status') }}: {{ formatStatusName(activeFilters.status) }}
              <button @click="clearFilter('status')" class="close-btn">✕</button>
            </span>
            <span v-if="activeFilters.categoryId" class="filter-chip">
              {{ formatFilterLabel('categoryId') }}: {{ getCategoryName(activeFilters.categoryId) }}
              <button @click="clearFilter('categoryId')" class="close-btn">✕</button>
            </span>
            <span v-if="activeFilters.cityId" class="filter-chip">
              {{ formatFilterLabel('cityId') }}: {{ getCityName(activeFilters.cityId) }}
              <button @click="clearFilter('cityId')" class="close-btn">✕</button>
            </span>
            <span v-if="activeFilters.minPrice" class="filter-chip">
              Desde: {{ formatPrice(activeFilters.minPrice) }}
              <button @click="clearFilter('minPrice')" class="close-btn">✕</button>
            </span>
            <span v-if="activeFilters.maxPrice" class="filter-chip">
              Hasta: {{ formatPrice(activeFilters.maxPrice) }}
              <button @click="clearFilter('maxPrice')" class="close-btn">✕</button>
            </span>
          </div>
          <button @click="clearAllFilters" class="btn-clear-all">Limpiar todos</button>
        </div>
      </div>
    </section>

    <PropertiesGrid />

    <TheFooter />
  </div>
</template>

<script setup>
// Composable para filtros
const { parseURLFilters } = usePropertyFilters()
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

// Estados para nombres de categoría y ciudad
const categoryNames = ref({})
const cityNames = ref({})
const loadingNames = ref(true)

// Parsear filtros de URL
const parsedFilters = parseURLFilters()
const hasActiveFilters = ref(parsedFilters.hasFilters)

// Objeto con filtros activos
const activeFilters = ref({
  status: route.query.status || '',
  categoryId: route.query.categoryId || '',
  cityId: route.query.cityId || '',
  minPrice: route.query.minPrice ? parseInt(route.query.minPrice) : null,
  maxPrice: route.query.maxPrice ? parseInt(route.query.maxPrice) : null
})

// Cargar nombres de categorías y ciudades
const loadFilterNames = async () => {
  try {
    // Cargar todas las categorías
    const { data: categories } = await supabase
      .from('category')
      .select('id, name')

    if (categories) {
      categories.forEach(cat => {
        categoryNames.value[cat.id] = cat.name
      })
    }

    // Cargar todas las ciudades
    const { data: cities } = await supabase
      .from('city')
      .select('id, name')

    if (cities) {
      cities.forEach(city => {
        cityNames.value[city.id] = city.name
      })
    }

    loadingNames.value = false
  } catch (err) {
    console.error('❌ Error al cargar nombres de filtros:', err)
    loadingNames.value = false
  }
}

// Obtener nombre de categoría
const getCategoryName = (id) => {
  return categoryNames.value[id] || id
}

// Obtener nombre de ciudad
const getCityName = (id) => {
  return cityNames.value[id] || id
}

// Formatear etiqueta de filtro
const formatFilterLabel = (key) => {
  const labels = {
    'status': 'Tipo',
    'categoryId': 'Categoría',
    'cityId': 'Ciudad',
    'minPrice': 'Precio mínimo',
    'maxPrice': 'Precio máximo'
  }
  return labels[key] || key
}

// Formatear nombre de status
const formatStatusName = (status) => {
  const statusNames = {
    'venta': 'Venta',
    'arriendo': 'Arriendo',
    'proyectos': 'Proyectos'
  }
  return statusNames[status] || status
}

// Formatear precio
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Limpiar un filtro específico
const clearFilter = (filterKey) => {
  const newQuery = { ...route.query }
  delete newQuery[filterKey]
  router.push({ query: newQuery })
}

// Limpiar todos los filtros
const clearAllFilters = () => {
  router.push({ query: {} })
}

// Cargar nombres al montar
onMounted(() => {
  loadFilterNames()
})

// Página de listado de propiedades
useSeoMeta({
  title: 'Propiedades - EuroInmobiliaria',
  description: 'Explora todas nuestras propiedades disponibles en el Oriente Antioqueño'
})
</script>

<style scoped>
.properties-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.page-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 4rem 0 3rem;
  text-align: center;
  margin-top: 70px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Estilos para filtros activos */
.active-filters {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
}

.filter-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.filter-badge .icon {
  font-size: 1.25rem;
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-weight: bold;
  opacity: 0.7;
  transition: opacity 0.2s;
  margin-left: 0.25rem;
}

.close-btn:hover {
  opacity: 1;
}

.btn-clear-all {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-clear-all:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .page-header {
    padding: 3rem 0 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .page-header p {
    font-size: 1rem;
  }

  .filters-list {
    justify-content: center;
  }
}
</style>
