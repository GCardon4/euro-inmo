<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <NuxtLink to="/" class="logo">
          <h2>Euro Inmo</h2>
        </NuxtLink>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/admin/dashboard" class="nav-item">
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </NuxtLink>

        <div class="nav-section">
          <p class="section-title">Gestión</p>
          
          <NuxtLink to="/admin/properties" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span>Propiedades</span>
          </NuxtLink>

          <NuxtLink to="/admin/agents" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Agentes</span>
          </NuxtLink>

          <NuxtLink to="/admin/categories" class="nav-item">
            <span class="nav-icon">📂</span>
            <span>Categorías</span>
          </NuxtLink>

          <NuxtLink to="/admin/amenities" class="nav-item">
            <span class="nav-icon">✨</span>
            <span>Características</span>
          </NuxtLink>

          <NuxtLink to="/admin/locations" class="nav-item">
            <span class="nav-icon">📍</span>
            <span>Ubicaciones</span>
          </NuxtLink>

          <NuxtLink v-if="authStore.isAdmin" to="/admin/users" class="nav-item">
            <span class="nav-icon">👤</span>
            <span>Usuarios</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <p class="section-title">Cuenta</p>
          
          <NuxtLink to="/" class="nav-item">
            <span class="nav-icon">🌐</span>
            <span>Ver Sitio</span>
          </NuxtLink>

          <button @click="handleLogout" class="nav-item logout-btn">
            <span class="nav-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Contenido Principal -->
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Obtener cliente Supabase en el contexto del componente
const supabase = useSupabaseClient()

// Manejar logout
const handleLogout = async () => {
  await authStore.signOut(supabase)
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  text-decoration: none;
}

.logo h2 {
  color: #2563eb;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
}

.sidebar-nav {
  padding: 1.5rem 0;
  flex: 1;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-title {
  padding: 0.5rem 1.5rem;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.5rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.nav-item.router-link-active {
  background: #eff6ff;
  color: #2563eb;
  border-right: 3px solid #2563eb;
}

.nav-icon {
  font-size: 1.25rem;
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style>
