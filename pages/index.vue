<template>
  <div class="home-page">
    <!-- Header -->
    <ClientOnly>
      <TheHeader />
    </ClientOnly>

    <!-- Hero con Slider y Filtros -->
    <HeroSection />

    <!-- Grid de Propiedades Destacadas -->
    <PropertiesGrid />

    <!-- Información de la Empresa -->
    <AboutSection />

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
  title: 'EuroInmobiliaria - Propiedades en el Oriente Antioqueño',
  description: 'Encuentra tu hogar ideal en el Oriente Antioqueño. Casas, apartamentos, fincas y más. Más de 10 años de experiencia en bienes raíces.',
  ogTitle: 'EuroInmobiliaria - Propiedades en el Oriente Antioqueño',
  ogDescription: 'Las mejores propiedades del Oriente Antioqueño. Compra, venta y arriendo.',
  ogType: 'website',
  ogUrl: 'https://euro-inmo.com',
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
      href: 'https://euro-inmo.com'
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
</style>
