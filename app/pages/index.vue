<template>
  <div class="home-page">
    <!-- Header -->
    <TheHeader />

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

<script setup>
// Configuración SEO para la página principal
useHead({
  title: 'Euro Inmo - Propiedades en el Oriente Antioqueño',
  meta: [
    {
      name: 'description',
      content: 'Encuentra tu hogar ideal en el Oriente Antioqueño. Casas, apartamentos, fincas y más. Más de 10 años de experiencia en bienes raíces.'
    },
    {
      property: 'og:title',
      content: 'Euro Inmo - Propiedades en el Oriente Antioqueño'
    },
    {
      property: 'og:description',
      content: 'Las mejores propiedades del Oriente Antioqueño. Compra, venta y arriendo.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
