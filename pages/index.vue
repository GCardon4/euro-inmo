<template>
  <div class="home-page">
    <!-- Header -->
    <ClientOnly>
      <TheHeader />
    </ClientOnly>

    <!-- Hero con Slider y Filtros -->
    <HeroSection />

    <!-- Enlaces a inmuebles por tipo -->
    <section class="properties-links-section">
      <NuxtLink to="/properties?status=arriendo" class="property-link-card link-arriendo">
        <span class="material-icons property-link-icon">vpn_key</span>
        <h2 class="property-link-title">Inmuebles Arriendo</h2>
      </NuxtLink>
      <NuxtLink to="/properties?status=venta" class="property-link-card link-venta">
        <span class="material-icons property-link-icon">sell</span>
        <h2 class="property-link-title">Inmuebles Venta</h2>
      </NuxtLink>
    </section>

    <!-- Sección de Proyectos -->
    <ProjectSection />

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

.properties-links-section {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.property-link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  border: 2px solid #0b6182;
  border-radius: 0.75rem;
  padding: 2rem 3rem;
  flex: 1;
  max-width: 400px;
  background: white;
  color: #0b6182;
  transition: all 0.3s ease;
}

.property-link-card:hover {
  transform: translateY(-3px);
  opacity: 0.85;
}

.property-link-icon {
  font-size: 56px;
  color: #0b6182;
}

.property-link-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0b6182;
}

@media (max-width: 600px) {
  .properties-links-section {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem 1rem;
  }

  .property-link-card {
    width: 100%;
    max-width: 100%;
    padding: 1.5rem 2rem;
    flex-direction: row;
    justify-content: center;
  }

  .property-link-icon {
    font-size: 36px;
  }

  .property-link-title {
    font-size: 1.25rem;
  }
}
</style>
