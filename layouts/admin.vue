<template>
  <div class="admin-layout">
    <!-- Header superior -->
    <header class="admin-header">
      <div class="header-left">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <span class="material-icons">{{ sidebarOpen ? 'close' : 'menu' }}</span>
        </button>
        <NuxtLink to="/admin/dashboard" class="header-logo">
          <span class="logo-text">Euro Inmo</span>
          <span class="logo-badge">Admin</span>
        </NuxtLink>
      </div>

      <nav class="header-nav">
        <NuxtLink to="/admin/dashboard" class="header-nav-item">
          <span class="material-icons">dashboard</span>
          <span class="nav-label">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/admin/properties" class="header-nav-item">
          <span class="material-icons">home_work</span>
          <span class="nav-label">Propiedades</span>
        </NuxtLink>
        <NuxtLink to="/admin/projects" class="header-nav-item">
          <span class="material-icons">apartment</span>
          <span class="nav-label">Proyectos</span>
        </NuxtLink>
        <NuxtLink to="/admin/agents" class="header-nav-item">
          <span class="material-icons">groups</span>
          <span class="nav-label">Agentes</span>
        </NuxtLink>
        <NuxtLink to="/admin/categories" class="header-nav-item">
          <span class="material-icons">category</span>
          <span class="nav-label">Categorias</span>
        </NuxtLink>
        <NuxtLink to="/admin/amenities" class="header-nav-item">
          <span class="material-icons">star</span>
          <span class="nav-label">Atributos</span>
        </NuxtLink>
        <NuxtLink to="/admin/locations" class="header-nav-item">
          <span class="material-icons">place</span>
          <span class="nav-label">Ubicaciones</span>
        </NuxtLink>
        <NuxtLink v-if="authStore.isAdmin" to="/admin/users" class="header-nav-item">
          <span class="material-icons">person</span>
          <span class="nav-label">Usuarios</span>
        </NuxtLink>
      </nav>

      <div class="header-right">
        <NuxtLink to="/" class="header-action" title="Ver sitio web">
          <span class="material-icons">language</span>
        </NuxtLink>
        <div class="user-menu">
          <span class="user-name">{{ authStore.fullName || 'Usuario' }}</span>
          <button @click="handleLogout" class="btn-logout" title="Cerrar sesion">
            <span class="material-icons">logout</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Menú móvil desplegable -->
    <nav v-if="sidebarOpen" class="mobile-nav">
      <NuxtLink to="/admin/dashboard" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">dashboard</span>
        <span>Dashboard</span>
      </NuxtLink>
      <NuxtLink to="/admin/properties" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">home_work</span>
        <span>Propiedades</span>
      </NuxtLink>
      <NuxtLink to="/admin/projects" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">apartment</span>
        <span>Proyectos</span>
      </NuxtLink>
      <NuxtLink to="/admin/agents" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">groups</span>
        <span>Agentes</span>
      </NuxtLink>
      <NuxtLink to="/admin/categories" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">category</span>
        <span>Categorias</span>
      </NuxtLink>
      <NuxtLink to="/admin/amenities" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">star</span>
        <span>Atributos</span>
      </NuxtLink>
      <NuxtLink to="/admin/locations" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">place</span>
        <span>Ubicaciones</span>
      </NuxtLink>
      <NuxtLink v-if="authStore.isAdmin" to="/admin/users" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">person</span>
        <span>Usuarios</span>
      </NuxtLink>
      <div class="mobile-nav-divider"></div>
      <NuxtLink to="/" class="mobile-nav-item" @click="closeSidebar">
        <span class="material-icons">language</span>
        <span>Ver Sitio</span>
      </NuxtLink>
      <button @click="handleLogout" class="mobile-nav-item mobile-logout">
        <span class="material-icons">logout</span>
        <span>Cerrar Sesion</span>
      </button>
    </nav>

    <!-- Contenido Principal centrado -->
    <main class="main-content">
      <div class="content-container">
        <slot />
      </div>
    </main>

    <!-- Notificaciones y diálogos -->
    <AdminNotification />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const supabase = useSupabaseClient()
const route = useRoute()

// Estado del sidebar (movil)
const sidebarOpen = ref(false)

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Cerrar sidebar al cambiar de ruta
watch(() => route.path, () => {
  sidebarOpen.value = false
})

// Manejar logout
const handleLogout = async () => {
  closeSidebar()
  await authStore.signOut(supabase)
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f3f4f6;
}

/* ===== HEADER ===== */
.admin-header {
  position: sticky;
  top: 0;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: #374151;
  transition: background 0.2s;
}

.menu-toggle:hover {
  background: #f3f4f6;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #2563eb;
}

.logo-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #2563eb;
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  letter-spacing: 0.5px;
}

/* Nav links en el header */
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.header-nav-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.header-nav-item .material-icons {
  font-size: 1.125rem;
}

.header-nav-item:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.header-nav-item.router-link-active {
  background: #eff6ff;
  color: #2563eb;
}

/* Header right */
.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.header-action:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.header-action .material-icons {
  font-size: 1.25rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid #e5e7eb;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #fee2e2;
}

.btn-logout .material-icons {
  font-size: 1.25rem;
}

/* ===== MENÚ MÓVIL ===== */
.mobile-nav {
  display: none;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-nav-item .material-icons {
  font-size: 1.2rem;
  color: #6b7280;
}

.mobile-nav-item:hover {
  background: #f3f4f6;
}

.mobile-nav-item.router-link-active {
  background: #eff6ff;
  color: #2563eb;
}

.mobile-nav-item.router-link-active .material-icons {
  color: #2563eb;
}

.mobile-nav-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 1.5rem;
}

.mobile-logout {
  color: #ef4444;
}

.mobile-logout .material-icons {
  color: #ef4444;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  min-height: calc(100vh - 60px);
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1100px) {
  .header-nav .nav-label {
    display: none;
  }

  .header-nav-item {
    padding: 0.5rem;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .header-nav {
    display: none;
  }

  .user-name {
    display: none;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 0.5rem 0;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    z-index: 90;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .content-container {
    padding: 1.5rem 1rem;
  }
}
</style>
