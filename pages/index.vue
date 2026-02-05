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
</style>
