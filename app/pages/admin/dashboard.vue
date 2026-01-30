<template>
  <div class="dashboard-page">
    <!-- Header del Dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="user-info">
          <h1>Dashboard Administrativo</h1>
          <p>Bienvenido, {{ authStore.fullName || 'Usuario' }}</p>
        </div>
        <div class="header-actions">
          <NuxtLink to="/" class="btn-secondary">
            Ver Sitio
          </NuxtLink>
          <button @click="handleLogout" class="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido del Dashboard -->
    <div class="dashboard-content">
      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏠</div>
          <div class="stat-info">
            <h3>{{ stats.totalProperties }}</h3>
            <p>Propiedades Totales</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>{{ stats.propertiesForSale }}</h3>
            <p>En Venta</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔑</div>
          <div class="stat-info">
            <h3>{{ stats.propertiesForRent }}</h3>
            <p>En Arriendo</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Usuarios</p>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <NuxtLink to="/admin/createProperty" class="action-card">
            <span class="action-icon">➕</span>
            <h3>Nueva Propiedad</h3>
            <p>Agregar una nueva propiedad al sistema</p>
          </NuxtLink>

          <NuxtLink to="/admin/properties" class="action-card">
            <span class="action-icon">📋</span>
            <h3>Ver Propiedades</h3>
            <p>Administrar propiedades existentes</p>
          </NuxtLink>

          <NuxtLink to="/admin/users" class="action-card" v-if="authStore.isAdmin">
            <span class="action-icon">👤</span>
            <h3>Usuarios</h3>
            <p>Gestionar usuarios del sistema</p>
          </NuxtLink>

          <NuxtLink to="/admin/settings" class="action-card">
            <span class="action-icon">⚙️</span>
            <h3>Configuración</h3>
            <p>Ajustes del sistema</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Propiedades más visitadas -->
      <div class="recent-section">
        <h2>Propiedades Más Visitadas</h2>
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-else-if="topProperties.length > 0" class="properties-list">
          <div v-for="property in topProperties" :key="property.id" class="property-item">
            <div class="property-info">
              <h4>{{ property.name }}</h4>
              <p>{{ property.city?.name }} - {{ property.status }}</p>
            </div>
            <div class="property-stats">
              <span class="views">👁️ {{ property.views_count || 0 }} vistas</span>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No hay datos de propiedades aún</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})

// Meta tags
useHead({
  title: 'Dashboard - Euro Inmo Admin'
})

// Store de autenticación
const authStore = useAuthStore()

// Estados
const loading = ref(false)
const stats = ref({
  totalProperties: 0,
  propertiesForSale: 0,
  propertiesForRent: 0,
  totalUsers: 0
})
const topProperties = ref([])

// Cargar estadísticas
const loadStats = async () => {
  loading.value = true
  const supabase = useSupabaseClient()

  try {
    // Total de propiedades
    const { count: totalCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    stats.value.totalProperties = totalCount || 0

    // Propiedades en venta
    const { count: saleCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('status', 'Venta')

    stats.value.propertiesForSale = saleCount || 0

    // Propiedades en arriendo
    const { count: rentCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('status', 'Arriendo')

    stats.value.propertiesForRent = rentCount || 0

    // Total usuarios (solo si es admin)
    if (authStore.isAdmin) {
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      stats.value.totalUsers = usersCount || 0
    }

    // Propiedades más visitadas
    const { data: properties } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        code,
        status,
        city:city_id(name)
      `)
      .eq('is_active', true)
      .limit(5)

    if (properties) {
      // Contar vistas por cada propiedad
      for (const property of properties) {
        const { count } = await supabase
          .from('properties_view')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', property.id)

        property.views_count = count || 0
      }

      // Ordenar por vistas
      topProperties.value = properties.sort((a, b) => b.views_count - a.views_count)
    }

  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  } finally {
    loading.value = false
  }
}

// Manejar logout
const handleLogout = async () => {
  await authStore.signOut()
}

// Cargar datos al montar
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f3f4f6;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info h1 {
  font-size: 1.75rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.user-info p {
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary,
.btn-logout {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  font-size: 0.95rem;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-logout {
  background: #ef4444;
  color: white;
}

.btn-logout:hover {
  background: #dc2626;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 800;
  color: #2563eb;
  margin: 0;
}

.stat-info p {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
}

.quick-actions,
.recent-section {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-actions h2,
.recent-section h2 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-card:hover {
  border-color: #2563eb;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.1);
}

.action-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.action-card h3 {
  font-size: 1.125rem;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.action-card p {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.properties-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: background 0.3s ease;
}

.property-item:hover {
  background: #f9fafb;
}

.property-info h4 {
  margin: 0 0 0.25rem 0;
  color: #111827;
}

.property-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.views {
  color: #2563eb;
  font-weight: 600;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .dashboard-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>