<template>
  <div class="properties-page">
    <TheHeader />
    
    <section class="page-header">
      <div class="container">
        <h1>Propiedades</h1>
        <p>Encuentra tu propiedad ideal en el Oriente Antioqueño</p>
      </div>
    </section>

    <PropertiesGrid />

    <TheFooter />
  </div>
</template>

<script setup>
// Página de listado de propiedades
useSeoMeta({
  title: 'Propiedades - EuroInmobiliaria',
  description: 'Explora todas nuestras propiedades disponibles en el Oriente Antioqueño'
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
