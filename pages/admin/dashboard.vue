<template>
  <div class="dashboard-page">
    <!-- Contenido del Dashboard -->
    <div class="dashboard-content">
      <div class="page-title">
        <h1>Dashboard Administrativo</h1>
        <p>Bienvenido, {{ authStore.fullName || 'Usuario' }}</p>
      </div>
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
        <h2>Gestión del Sistema</h2>
        <div class="actions-grid">
          <NuxtLink to="/admin/properties" class="action-card">
            <span class="action-icon">🏠</span>
            <h3>Propiedades</h3>
            <p>Administrar inmuebles y propiedades</p>
          </NuxtLink>

          <NuxtLink to="/admin/projects" class="action-card">
            <span class="action-icon">🏗️</span>
            <h3>Proyectos</h3>
            <p>Gestionar proyectos inmobiliarios</p>
          </NuxtLink>

          <NuxtLink to="/admin/agents" class="action-card">
            <span class="action-icon">👥</span>
            <h3>Agentes</h3>
            <p>Gestionar agentes inmobiliarios</p>
          </NuxtLink>

          <NuxtLink to="/admin/categories" class="action-card">
            <span class="action-icon">📂</span>
            <h3>Categorías</h3>
            <p>Administrar categorías de propiedades</p>
          </NuxtLink>

          <NuxtLink to="/admin/amenities" class="action-card">
            <span class="action-icon">✨</span>
            <h3>Atributos</h3>
            <p>Gestionar atributos de inmuebles</p>
          </NuxtLink>

          <NuxtLink to="/admin/locations" class="action-card">
            <span class="action-icon">📍</span>
            <h3>Ubicaciones</h3>
            <p>Gestionar ciudades y zonas</p>
          </NuxtLink>

          <NuxtLink to="/admin/users" class="action-card" v-if="authStore.isAdmin">
            <span class="action-icon">👤</span>
            <h3>Usuarios</h3>
            <p>Gestionar usuarios del sistema</p>
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
              <p>{{ property.city?.name }} - {{ property.status?.name }}</p>
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
  middleware: 'auth',
  layout: 'admin'
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
    const { count: totalCount, error: totalError } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)

    if (totalError) console.error('Error total:', totalError)
    stats.value.totalProperties = totalCount || 0

    // Propiedades en venta
    const { count: saleCount, error: saleError } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('status_id', 1)

    if (saleError) console.error('Error venta:', saleError)
    stats.value.propertiesForSale = saleCount || 0

    // Propiedades en arriendo
    const { count: rentCount, error: rentError } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('status_id', 2)

    if (rentError) console.error('Error arriendo:', rentError)
    stats.value.propertiesForRent = rentCount || 0

    // Total usuarios (solo si es admin)
    if (authStore.isAdmin) {
      try {
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })

        if (!usersError) {
          stats.value.totalUsers = usersCount || 0
        }
      } catch {
        // RLS puede bloquear esta consulta - no es crítico
      }
    }

    // Propiedades más visitadas
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select(`
        id,
        name,
        code,
        status(name),
        city(name)
      `)
      .eq('is_active', true)
      .limit(5)

    if (propsError) console.error('Error propiedades:', propsError)

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

// Cargar datos al montar
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard-page {
  background: #f3f4f6;
}

.dashboard-content {
  width: 100%;
}

.page-title h1 {
  font-size: 1.5rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-title p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info h3 {
  font-size: 2rem;
  color: #111827;
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
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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