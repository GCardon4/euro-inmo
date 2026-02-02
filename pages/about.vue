<template>
  <div class="about-page">
    <ClientOnly>
      <TheHeader />
    </ClientOnly>
    
    <section class="page-header">
      <div class="container">
        <h1>Nosotros</h1>
        <p>Conoce más sobre EuroInmobiliaria</p>
      </div>
    </section>

    <AboutSection />

    <TheFooter />
  </div>
</template>

<script setup>
// Página sobre nosotros
useSeoMeta({
  title: 'Nosotros - EuroInmobiliaria',
  description: 'Conoce nuestra historia y equipo en EuroInmobiliaria'
})
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: 4rem 0 3rem;
  text-align: center;
  margin-top: 70px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
