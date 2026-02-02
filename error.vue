<template>
  <div class="error-page">
    <div class="error-container">
      <h1>{{ error?.statusCode || 500 }}</h1>
      <h2>{{ error?.statusMessage || 'Error del servidor' }}</h2>
      <p>{{ error?.message || 'Algo salió mal. Por favor, intenta de nuevo más tarde.' }}</p>
      <button @click="handleError" class="btn-home">
        Volver al inicio
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0b6182, #82bad3);
  color: white;
  padding: 2rem;
}

.error-container {
  text-align: center;
  max-width: 600px;
}

h1 {
  font-size: 6rem;
  margin: 0;
  font-weight: bold;
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
}

p {
  font-size: 1.2rem;
  margin: 2rem 0;
  opacity: 0.9;
}

.btn-home {
  background: white;
  color: #0b6182;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-home:hover {
  transform: translateY(-2px);
}
</style>
