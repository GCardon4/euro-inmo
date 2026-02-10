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
      <div class="hero-heading">
        <h1 class="hero-title">Invertir SEGURO, empieza aquí</h1>
        <img
          src="/label-euro.png"
          alt="Euro Inmobiliaria - 14 años acompañando familias"
          class="hero-label"
        >
      </div>
      <p class="hero-subtitle">
        Las mejores propiedades del Oriente Antioqueño en un solo lugar
      </p>

      <!-- Filtros de búsqueda -->
      <div class="search-filters">
        <div class="status-toggle">
          <button
            class="status-toggle-btn"
            :class="{ active: selectedStatus === 'arriendo' }"
            @click="selectedStatus = selectedStatus === 'arriendo' ? '' : 'arriendo'"
          >
            Arriendos
          </button>
          <button
            class="status-toggle-btn"
            :class="{ active: selectedStatus === 'venta' }"
            @click="selectedStatus = selectedStatus === 'venta' ? '' : 'venta'"
          >
            Ventas
          </button>
        </div>

        <div class="filter-checks">
          <label
            v-for="status in propertyStatuses"
            :key="status.value"
            class="filter-check"
          >
            <input
              type="radio"
              name="statusCheck"
              :value="status.value"
              v-model="selectedStatus"
              class="filter-check-input"
            >
            <span class="filter-check-label">{{ status.label }}</span>
          </label>
        </div>

        <form class="search-form" @submit.prevent="handleSearch">
          <!-- Tipo de propiedad -->
          <div class="form-group">
            <label for="category">Tipo de Propiedad</label>
            <select v-model="searchFilters.categoryId" id="category" class="form-select">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name.toLowerCase()">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Ubicación -->
          <div class="form-group">
            <label for="location">Ubicación</label>
            <select v-model="searchFilters.cityId" id="location" class="form-select">
              <option value="">Todas las ciudades</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <!-- Rango de precio -->
          <div class="form-group">
            <label for="minPrice">Precio Mínimo</label>
            <input
              :value="displayMinPrice"
              @input="onMinPriceInput"
              type="text"
              inputmode="numeric"
              id="minPrice"
              class="form-input"
              placeholder="Ej: 100.000.000"
            >
          </div>

          <div class="form-group">
            <label for="maxPrice">Precio Máximo</label>
            <input
              :value="displayMaxPrice"
              @input="onMaxPriceInput"
              type="text"
              inputmode="numeric"
              id="maxPrice"
              class="form-input"
              placeholder="Ej: 500.000.000"
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
const router = useRouter()
const route = useRoute()
const supabase = useSupabaseClient()

// Ciudades desde Supabase
const cities = ref([])

const loadCities = async () => {
  try {
    const { data, error } = await supabase
      .from('city')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      console.error('❌ Error al cargar ciudades:', error)
      return
    }
    cities.value = data || []
  } catch (err) {
    console.error('❌ Error en loadCities:', err)
  }
}

// Categorías desde Supabase
const categories = ref([])

const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('category')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      console.error('❌ Error al cargar categorías:', error)
      return
    }
    categories.value = data || []
  } catch (err) {
    console.error('❌ Error en loadCategories:', err)
  }
}

// Estados de la propiedad (arriendo/venta)
const propertyStatuses = [
  { label: 'Venta', value: 'venta' },
  { label: 'Arriendo', value: 'arriendo' },
  { label: 'Proyectos', value: 'proyectos' }
]

// Estado del filtro de búsqueda
const selectedStatus = ref('')

// Sincronizar selectedStatus con la URL para que PropertiesGrid reaccione
watch(selectedStatus, (newStatus) => {
  const query = { ...route.query }
  if (newStatus) {
    query.status = newStatus
  } else {
    delete query.status
  }
  router.replace({ query })
})
const searchFilters = ref({
  categoryId: '',
  cityId: '',
  minPrice: null,
  maxPrice: null
})

// Formateo de precios con puntos de miles (COP)
const formatCOP = (value) => {
  if (!value && value !== 0) return ''
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseCOP = (formatted) => {
  const cleaned = formatted.replace(/\./g, '').replace(/\D/g, '')
  return cleaned ? parseInt(cleaned) : null
}

const displayMinPrice = computed(() => formatCOP(searchFilters.value.minPrice))
const displayMaxPrice = computed(() => formatCOP(searchFilters.value.maxPrice))

const onMinPriceInput = (e) => {
  searchFilters.value.minPrice = parseCOP(e.target.value)
}

const onMaxPriceInput = (e) => {
  searchFilters.value.maxPrice = parseCOP(e.target.value)
}

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
  // Construir objeto de filtros, excluyendo valores vacíos
  const filters = {}
  
  if (selectedStatus.value) {
    filters.status = selectedStatus.value
  }
  
  if (searchFilters.value.categoryId) {
    filters.categoryId = searchFilters.value.categoryId
  }
  
  if (searchFilters.value.cityId) {
    filters.cityId = searchFilters.value.cityId
  }
  
  if (searchFilters.value.minPrice) {
    filters.minPrice = searchFilters.value.minPrice
  }
  
  if (searchFilters.value.maxPrice) {
    filters.maxPrice = searchFilters.value.maxPrice
  }
  
  if (process.client) {
    console.log('🔍 Buscando con filtros:', filters)
  }
  
  // Navegar a página de propiedades con los filtros
  navigateTo({
    path: '/properties',
    query: filters
  })
}

// Lifecycle
onMounted(() => {
  startSlider()
  loadCities()
  loadCategories()
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

.hero-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-label {
  width: 160px;
  height: 160px;
  object-fit: contain;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.5));
  flex-shrink: 0;
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

.status-toggle {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.status-toggle-btn {
  padding: 1rem 3rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #585857;
  font-weight: 700;
  font-size: 1.15rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-toggle-btn:hover {
  border-color: #0b6182;
  color: #0b6182;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 97, 130, 0.15);
}

.status-toggle-btn.active {
  background: linear-gradient(135deg, #0b6182 0%, #094d68 100%);
  color: white;
  border-color: #0b6182;
  box-shadow: 0 4px 16px rgba(11, 97, 130, 0.3);
}

.filter-checks {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.filter-check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #585857;
  font-weight: 600;
  user-select: none;
}

.filter-check-input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #0b6182;
  cursor: pointer;
  margin: 0;
}

.filter-check-label {
  transition: color 0.2s ease;
}

.filter-check:hover .filter-check-label {
  color: #0b6182;
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

  .hero-label {
    width: 130px;
    height: 130px;
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
    min-height: auto;
    max-height: none;
    overflow: visible;
  }

  .hero-content {
    padding: 4rem 1rem 2rem;
  }

  .hero-heading {
    flex-direction: column;
    gap: 0.75rem;
  }

  .hero-label {
    width: 110px;
    height: 110px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .search-filters {
    padding: 1.25rem;
  }

  .search-form {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .btn-search {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
  }

  .status-toggle-btn {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }

  .filter-checks {
    gap: 1rem;
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
