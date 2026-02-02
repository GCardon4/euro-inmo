<template>
  <section class="hero">
    <!-- Slider de imágenes de fondo -->
    <div class="hero-slider">
      <div 
        v-for="(image, index) in heroImages" 
        :key="index" 
        class="hero-slide"
        :class="{ active: currentSlide === index }"
        :style="{ backgroundImage: `url(${image})` }"
      >
        <div class="hero-overlay"></div>
      </div>
    </div>

    <!-- Contenido del Hero -->
    <div class="hero-content">
      <h1 class="hero-title">Encuentra Tu Hogar Ideal</h1>
      <p class="hero-subtitle">
        Las mejores propiedades del Oriente Antioqueño en un solo lugar
      </p>

      <!-- Filtros de búsqueda -->
      <div class="search-filters">
        <div class="filter-tabs">
          <button 
            v-for="status in propertyStatuses" 
            :key="status.value"
            class="filter-tab"
            :class="{ active: selectedStatus === status.value }"
            @click="selectedStatus = status.value"
          >
            {{ status.label }}
          </button>
        </div>

        <form class="search-form" @submit.prevent="handleSearch">
          <!-- Tipo de propiedad -->
          <div class="form-group">
            <label for="category">Tipo de Propiedad</label>
            <select v-model="searchFilters.categoryId" id="category" class="form-select">
              <option value="">Todas las categorías</option>
              <option value="1">Apartamento</option>
              <option value="2">Casa</option>
              <option value="3">Finca</option>
              <option value="4">Lote</option>
              <option value="5">Local</option>
            </select>
          </div>

          <!-- Ubicación -->
          <div class="form-group">
            <label for="location">Ubicación</label>
            <select v-model="searchFilters.cityId" id="location" class="form-select">
              <option value="">Todas las ciudades</option>
              <option value="1">Rionegro</option>
              <option value="2">La Ceja</option>
              <option value="3">El Retiro</option>
              <option value="4">Marinilla</option>
              <option value="5">Guarne</option>
            </select>
          </div>

          <!-- Rango de precio -->
          <div class="form-group">
            <label for="minPrice">Precio Mínimo</label>
            <input 
              v-model.number="searchFilters.minPrice" 
              type="number" 
              id="minPrice" 
              class="form-input"
              placeholder="Ej: 100000000"
            >
          </div>

          <div class="form-group">
            <label for="maxPrice">Precio Máximo</label>
            <input 
              v-model.number="searchFilters.maxPrice" 
              type="number" 
              id="maxPrice" 
              class="form-input"
              placeholder="Ej: 500000000"
            >
          </div>

          <!-- Botón de búsqueda -->
          <button type="submit" class="btn-search">
            <Icon name="search" />
            <span>Buscar</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Indicadores del slider -->
    <div class="slider-indicators">
      <button
        v-for="(image, index) in heroImages"
        :key="index"
        class="indicator"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="`Ir a slide ${index + 1}`"
      ></button>
    </div>

    <!-- Navegación del slider -->
    <button class="slider-nav prev" @click="prevSlide" aria-label="Anterior">‹</button>
    <button class="slider-nav next" @click="nextSlide" aria-label="Siguiente">›</button>
  </section>
</template>

<script setup>
// Estados de la propiedad (arriendo/venta)
const propertyStatuses = [
  { label: 'Venta', value: 'venta' },
  { label: 'Arriendo', value: 'arriendo' },
  { label: 'Ambos', value: '' }
]

// Estado del filtro de búsqueda
const selectedStatus = ref('')
const searchFilters = ref({
  categoryId: '',
  cityId: '',
  minPrice: null,
  maxPrice: null
})

// Imágenes del slider (placeholders)
const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'
]

// Estado del slider
const currentSlide = ref(0)
let sliderInterval = null

// Cambiar a slide anterior
const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? heroImages.length - 1 
    : currentSlide.value - 1
  resetSliderInterval()
}

// Cambiar a slide siguiente
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroImages.length
  resetSliderInterval()
}

// Ir a un slide específico
const goToSlide = (index) => {
  currentSlide.value = index
  resetSliderInterval()
}

// Reiniciar intervalo automático
const resetSliderInterval = () => {
  if (sliderInterval) {
    clearInterval(sliderInterval)
  }
  startSlider()
}

// Iniciar slider automático
const startSlider = () => {
  sliderInterval = setInterval(() => {
    nextSlide()
  }, 5000)
}

// Manejar búsqueda
const handleSearch = () => {
  const filters = {
    status: selectedStatus.value,
    ...searchFilters.value
  }
  console.log('Buscando con filtros:', filters)
  // TODO: Implementar navegación con filtros
  navigateTo({
    path: '/properties',
    query: filters
  })
}

// Lifecycle
onMounted(() => {
  startSlider()
})

onUnmounted(() => {
  if (sliderInterval) {
    clearInterval(sliderInterval)
  }
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 90vh;
  min-height: 600px;
  max-height: 900px;
  overflow: hidden;
}

.hero-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.hero-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(11, 97, 130, 0.85) 0%, rgba(130, 186, 211, 0.75) 100%);
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 6rem 2rem 2rem;
  color: white;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin: 0 0 3rem 0;
  opacity: 0.95;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.search-filters {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
  max-width: 1100px;
  margin: 0 auto;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-tab {
  padding: 0.75rem 2rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #585857;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #0b6182;
  color: #0b6182;
}

.filter-tab.active {
  background: #0b6182;
  color: white;
  border-color: #0b6182;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-select,
.form-input {
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  background: white;
  transition: border-color 0.3s ease;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.btn-search {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #0b6182 0%, #094d68 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(11, 97, 130, 0.3);
}

.slider-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 0.75rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.3);
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.slider-nav.prev {
  left: 2rem;
}

.slider-nav.next {
  right: 2rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .search-form {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    height: auto;
    min-height: 100vh;
  }

  .hero-content {
    padding: 4rem 1rem 2rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .search-filters {
    padding: 1.5rem;
  }

  .search-form {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    flex-direction: column;
  }

  .slider-nav {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .slider-nav.prev {
    left: 1rem;
  }

  .slider-nav.next {
    right: 1rem;
  }
}
</style>
