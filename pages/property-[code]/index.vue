<template>
  <div class="property-detail">
    <h1>Detalle de Propiedad</h1>
    <p>Vista de detalle en construcción</p>
    <p v-if="route.params.code">Código: {{ route.params.code }}</p>
  </div>
</template>

<script setup>
// Vista de detalle de propiedad
const route = useRoute()
</script>

<style scoped>
.property-detail {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
</style>