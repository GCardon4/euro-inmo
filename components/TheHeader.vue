<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <NuxtLink to="/" class="logo-link">
          <img src="/logotipo-euro.svg" alt="Euro Inmo Logo" class="logo-img" />
          <span class="logo-text">Euro Inmo</span>
        </NuxtLink>
      </div>

      <!-- Navegación Desktop -->
      <nav class="nav-desktop">
        <NuxtLink to="/" class="nav-link">Inicio</NuxtLink>
        <NuxtLink to="/properties" class="nav-link">Propiedades</NuxtLink>
        <NuxtLink to="/about" class="nav-link">Nosotros</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Contacto</NuxtLink>
        
        <!-- Si está autenticado -->
        <NuxtLink v-if="isAuthenticated" to="/admin/dashboard" class="nav-link nav-link-admin">
          Dashboard
        </NuxtLink>
        <!-- Si no está autenticado -->
        <NuxtLink v-else to="/login" class="nav-link nav-link-admin">
          Login
        </NuxtLink>
      </nav>

      <!-- Botón menú móvil -->
      <button class="menu-toggle" @click="toggleMenu" :aria-expanded="isMenuOpen">
        <span class="menu-icon"></span>
        <span class="menu-icon"></span>
        <span class="menu-icon"></span>
      </button>
    </div>

    <!-- Navegación Móvil -->
    <nav v-if="isMenuOpen" class="nav-mobile">
      <NuxtLink to="/" class="nav-link-mobile" @click="closeMenu">Inicio</NuxtLink>
      <NuxtLink to="/properties" class="nav-link-mobile" @click="closeMenu">Propiedades</NuxtLink>
      <NuxtLink to="/about" class="nav-link-mobile" @click="closeMenu">Nosotros</NuxtLink>
      <NuxtLink to="/contact" class="nav-link-mobile" @click="closeMenu">Contacto</NuxtLink>
      
      <!-- Si está autenticado -->
      <NuxtLink v-if="isAuthenticated" to="/admin/dashboard" class="nav-link-mobile" @click="closeMenu">
        Dashboard
      </NuxtLink>
      <!-- Si no está autenticado -->
      <NuxtLink v-else to="/login" class="nav-link-mobile" @click="closeMenu">
        Login
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

// Store de autenticación
const authStore = useAuthStore()
const { isAuthenticated, fullName } = storeToRefs(authStore)

// Estado del menú móvil
const isMenuOpen = ref(false)

// Alternar menú móvil
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Cerrar menú móvil
const closeMenu = () => {
  isMenuOpen.value = false
}

// Inicializar autenticación
onMounted(async () => {
  await authStore.initAuth()
})
</script>

<style scoped>
.header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: -0.5px;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
  letter-spacing: -0.5px;
}

.logo a {
  text-decoration: none;
}

.nav-desktop {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #2563eb;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link-admin {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
}

.nav-link-admin::after {
  display: none;
}

.nav-link-admin:hover {
  background: #1d4ed8;
  color: white;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.25rem;
}

.menu-icon {
  width: 25px;
  height: 3px;
  background: #374151;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-mobile {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-mobile {
    display: flex;
    flex-direction: column;
    background: #f9fafb;
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-link-mobile {
    padding: 1rem;
    text-decoration: none;
    color: #374151;
    font-weight: 500;
    border-bottom: 1px solid #e5e7eb;
    transition: background 0.3s ease;
  }

  .nav-link-mobile:hover {
    background: #e5e7eb;
    color: #2563eb;
  }

  .nav-link-mobile:last-child {
    border-bottom: none;
  }
}
</style>
