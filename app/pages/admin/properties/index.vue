<template>
  <div class="properties-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Propiedades</h1>
        <p>Gestiona todas las propiedades del sistema</p>
      </div>
      <NuxtLink to="/admin/properties/create" class="btn-primary">
        <span>➕</span>
        <span>Nueva Propiedad</span>
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre o código..."
        class="search-input"
      >
      <select v-model="filterStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="Venta">Venta</option>
        <option value="Arriendo">Arriendo</option>
      </select>
      <select v-model="filterCategory" class="filter-select">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <p>Cargando propiedades...</p>
    </div>

    <!-- Tabla de propiedades -->
    <div v-else-if="filteredProperties.length > 0" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Precio</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="property in filteredProperties" :key="property.id">
            <td><span class="code">{{ property.code }}</span></td>
            <td class="property-name">{{ property.name }}</td>
            <td>{{ property.categorias?.name || '-' }}</td>
            <td>{{ property.city?.name || '-' }}</td>
            <td>
              <span class="badge" :class="property.status === 'Venta' ? 'badge-sale' : 'badge-rent'">
                {{ property.status }}
              </span>
            </td>
            <td class="price">{{ formatPrice(property.price) }}</td>
            <td>
              <span class="status-indicator" :class="property.is_active ? 'active' : 'inactive'">
                {{ property.is_active ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editProperty(property.id)" class="btn-action btn-edit" title="Editar">
                  ✏️
                </button>
                <button @click="deleteProperty(property)" class="btn-action btn-delete" title="Eliminar">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <span class="empty-icon">🏠</span>
      <h3>No hay propiedades</h3>
      <p>Comienza agregando tu primera propiedad</p>
      <NuxtLink to="/admin/properties/create" class="btn-primary">
        Crear Propiedad
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

useHead({
  title: 'Propiedades - Admin'
})

const supabase = useSupabaseClient()

// Estados
const loading = ref(false)
const properties = ref([])
const categories = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')

// Cargar propiedades
const loadProperties = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        categorias:category_id(*),
        city:city_id(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    properties.value = data || []
  } catch (error) {
    console.error('Error al cargar propiedades:', error)
    alert('Error al cargar propiedades')
  } finally {
    loading.value = false
  }
}

// Cargar categorías
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('name')

    if (error) throw error
    categories.value = data || []
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

// Propiedades filtradas
const filteredProperties = computed(() => {
  let filtered = properties.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(query) ||
      p.code?.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(p => p.status === filterStatus.value)
  }

  if (filterCategory.value) {
    filtered = filtered.filter(p => p.category_id === filterCategory.value)
  }

  return filtered
})

// Formatear precio
const formatPrice = (price) => {
  if (!price) return 'N/A'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price)
}

// Editar propiedad
const editProperty = (id) => {
  navigateTo(`/admin/properties/edit/${id}`)
}

// Eliminar propiedad
const deleteProperty = async (property) => {
  if (!confirm(`¿Estás seguro de eliminar "${property.name}"?`)) return

  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id)

    if (error) throw error

    alert('Propiedad eliminada exitosamente')
    await loadProperties()
  } catch (error) {
    console.error('Error al eliminar:', error)
    alert('Error al eliminar la propiedad')
  }
}

// Cargar datos al montar
onMounted(() => {
  loadProperties()
  loadCategories()
})
</script>

<style scoped>
.properties-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.filters-section {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
.filter-select {
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #2563eb;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.table-container {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.code {
  font-family: monospace;
  background: #eff6ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: #2563eb;
  font-weight: 600;
}

.property-name {
  font-weight: 600;
  color: #111827;
}

.price {
  font-weight: 600;
  color: #059669;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-sale {
  background: #d1fae5;
  color: #065f46;
}

.badge-rent {
  background: #dbeafe;
  color: #1e40af;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-indicator.active {
  background: #d1fae5;
  color: #065f46;
}

.status-indicator.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem;
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: #dbeafe;
}

.btn-delete:hover {
  background: #fee2e2;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters-section {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: auto;
  }
}
</style>
