<template>
  <div class="home-page">
    <!-- Header -->
    <ClientOnly>
      <TheHeader />
    </ClientOnly>

    <!-- Hero con Slider y Filtros -->
    <HeroSection />

    <!-- Enlace a todos los inmuebles -->
    <section class="all-properties-section">
      <NuxtLink to="/properties" class="link-all-properties">
        <h2 class="all-properties-title">Todos los Inmuebles</h2>
        <span class="material-icons all-properties-icon">home_work</span>
      </NuxtLink>
    </section>

    <!-- Información de la Empresa -->
    <AboutSection />

    <!-- Sección de Proyectos -->
    <ProjectSection />

    <!-- Sección de Agentes -->
    <AgentsSection />

    <!-- Sección de Contacto -->
    <ContactSection />

    <!-- Footer -->
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
// Configuración SEO para la página principal con useSeoMeta (mejor para Nuxt 3)
useSeoMeta({
  title: 'Euro Inmobiliaria - Con más de 14 años de experiencia en el Oriente Antioqueño',
  description: 'Invertir SEGURO, empieza aquí con Euro Inmobiliaria. Casas, apartamentos, fincas y más. Más de 14 años de experiencia en bienes raíces.',
  ogTitle: 'Euro Inmobiliaria - Con más de 14 años de experiencia en el Oriente Antioqueño',
  ogDescription: 'Invertir SEGURO, empieza aquí con Euro Inmobiliaria. Compra, venta y arriendo.',
  ogType: 'website',
  ogUrl: 'https://euroinmobiliaria.com.co',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})

// Configuración adicional del head
useHead({
  htmlAttrs: {
    lang: 'es'
  },
  link: [
    {
      rel: 'canonical',
      href: 'https://euroinmobiliaria.com.co'
    }
  ]
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.all-properties-section {
  display: flex;
  justify-content: center;
  padding: 3rem 2rem;
}

.link-all-properties {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  border: 2px solid #0b6182;
  border-radius: 0.75rem;
  padding: 2rem 3rem;
  transition: all 0.3s ease;
}

.link-all-properties:hover {
  transform: translateY(-3px);
  opacity: 0.85;
}

.all-properties-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  color: #0b6182;
}

.all-properties-icon {
  font-size: 56px;
  color: #0b6182;
}
</style>
