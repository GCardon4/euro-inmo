<template>
  <div class="property-detail-page">
    <!-- Header -->
    <ClientOnly>
      <TheHeader />
    </ClientOnly>

    <!-- Contenido principal -->
    <div class="detail-container">
      <div v-if="isLoading" class="loading-state">
        <Icon name="refresh" custom-class="spinner" />
        <p>Cargando propiedad...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon name="error_outline" />
        <h2>Error al cargar la propiedad</h2>
        <p>{{ error }}</p>
        <NuxtLink to="/" class="btn-back-home">Volver al inicio</NuxtLink>
      </div>

      <div v-else-if="property" class="property-content">
        <!-- Galería de imágenes -->
        <section class="gallery-section">
          <div class="main-image-container">
            <img 
              :src="currentImage" 
              :alt="property.name"
              class="main-image"
              @click="openModal"
            >
            <button 
              v-if="images.length > 1"
              class="nav-button prev"
              @click="previousImage"
            >
              <Icon name="chevron_left" />
            </button>
            <button 
              v-if="images.length > 1"
              class="nav-button next"
              @click="nextImage"
            >
              <Icon name="chevron_right" />
            </button>
          </div>

          <!-- Miniaturas -->
          <div v-if="images.length > 1" class="thumbnails">
            <button
              v-for="(image, index) in images"
              :key="index"
              class="thumbnail"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            >
              <img :src="image" :alt="`Imagen ${index + 1}`">
            </button>
          </div>
        </section>

        <!-- Información de la propiedad -->
        <section class="info-section">
          <div class="header-info">
            <div>
              <h1 class="property-title">{{ property.name }}</h1>
              <p class="property-code">Código: {{ property.code }}</p>
            </div>
            <div class="status-badge" :class="`badge-${property.status?.name?.toLowerCase()}`">
              {{ property.status?.name }}
            </div>
          </div>

          <!-- Precio -->
          <div class="price-section">
            <span class="label">Precio</span>
            <h2 class="price">{{ formattedPrice }}</h2>
            <span v-if="property.status?.name === 'Arriendo'" class="price-period">/mes</span>
          </div>

          <!-- Ubicación -->
          <div class="location-section">
            <Icon name="location_on" />
            <div>
              <p v-if="property.zone">{{ property.zone.name }}</p>
              <p v-if="property.city">{{ property.city.name }}</p>
            </div>
          </div>

          <!-- Detalles principales -->
          <div class="details-grid">
            <div v-if="property.rooms" class="detail-item">
              <Icon name="bed" />
              <div>
                <span class="label">Habitaciones</span>
                <p>{{ property.rooms }}</p>
              </div>
            </div>
            <div v-if="property.bathrooms" class="detail-item">
              <Icon name="bathtub" />
              <div>
                <span class="label">Baños</span>
                <p>{{ property.bathrooms }}</p>
              </div>
            </div>
            <div v-if="property.area" class="detail-item">
              <Icon name="square_foot" />
              <div>
                <span class="label">Área</span>
                <p>{{ property.area }} m²</p>
              </div>
            </div>
            <div v-if="property.category" class="detail-item">
              <Icon name="home_work" />
              <div>
                <span class="label">Tipo</span>
                <p>{{ property.category.name }}</p>
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div v-if="property.description" class="description-section">
            <h3>Descripción</h3>
            <p>{{ property.description }}</p>
          </div>

          <!-- Comodidades -->
          <div v-if="amenities.length > 0" class="amenities-section">
            <h3>Comodidades</h3>
            <div class="amenities-grid">
              <div v-for="amenity in amenities" :key="amenity.id" class="amenity-item">
                <span>{{ amenity.name }}</span>
              </div>
            </div>
          </div>

          <!-- Botón de contacto -->
          <div class="contact-section">
            <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="btn-contact">
              <Icon name="mail" />
              Contactar por WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>

    <!-- Modal para visualizar imagen en tamaño completo -->
    <div v-if="isModalOpen" class="image-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <Icon name="close" />
        </button>
        
        <img :src="currentImage" :alt="property.name" class="modal-image">
        
        <div class="modal-info">
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ images.length }}</span>
        </div>
        
        <button 
          v-if="images.length > 1"
          class="modal-nav-button prev"
          @click="previousImage"
        >
          <Icon name="chevron_left" />
        </button>
        
        <button 
          v-if="images.length > 1"
          class="modal-nav-button next"
          @click="nextImage"
        >
          <Icon name="chevron_right" />
        </button>
      </div>
    </div>

    <!-- Footer -->
    <ClientOnly>
      <TheFooter />
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const supabase = useSupabaseClient()

// Número de WhatsApp (cambiar aquí)
const whatsappNumber = '573001234567'

// Estados
const isLoading = ref(true)
const error = ref(null)
const property = ref(null)
const images = ref([])
const amenities = ref([])
const currentImageIndex = ref(0)
const isModalOpen = ref(false)

// Obtener código de la ruta
const propertyCode = route.params.code

// Imagen actual
const currentImage = computed(() => {
  return images.value[currentImageIndex.value] || '/property-img.jpg'
})

// Precio formateado
const formattedPrice = computed(() => {
  if (!property.value?.price) return 'Precio a consultar'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(property.value.price)
})

// Link de WhatsApp con mensaje personalizado
const whatsappLink = computed(() => {
  if (!property.value) return '#'
  
  const tipoPropiedad = property.value.category?.name || 'Propiedad'
  const zona = property.value.zone?.name || 'Sin especificar'
  const codigo = property.value.code
  
  const mensaje = `Quiero saber acerca de ${tipoPropiedad}, en ${zona}, con el código ${codigo}, Muchas gracias`
  const mensajeEncoded = encodeURIComponent(mensaje)
  
  return `https://wa.me/${whatsappNumber}?text=${mensajeEncoded}`
})

// Cargar datos de la propiedad
const loadProperty = async () => {
  try {
    // Cargar propiedad principal
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select(`
        id,
        code,
        name,
        description,
        price,
        rooms,
        bathrooms,
        area,
        is_active,
        category(id, name),
        status(id, name),
        state(id, name),
        city(id, name),
        zone(id, name)
      `)
      .eq('code', propertyCode)
      .single()

    if (propertyError) {
      throw new Error('Propiedad no encontrada')
    }

    property.value = propertyData

    // Cargar imágenes
    const { data: imagesData, error: imagesError } = await supabase
      .from('properties_images')
      .select('url_image')
      .eq('property_id', propertyData.id)
      .order('main', { ascending: false })

    if (!imagesError && imagesData) {
      images.value = imagesData.map(img => img.url_image)
    }

    // Si no hay imágenes, usar la por defecto
    if (images.value.length === 0) {
      images.value = ['/property-img.jpg']
    }

    // Cargar comodidades
    const { data: amenitiesData, error: amenitiesError } = await supabase
      .from('property_amenities')
      .select('amenity_id, amenities!inner(id, name)')
      .eq('property_id', propertyData.id)

    if (!amenitiesError && amenitiesData) {
      amenities.value = amenitiesData
        .filter(item => item.amenities)
        .map(item => item.amenities)
    }

  } catch (err) {
    console.error('Error cargando propiedad:', err)
    error.value = err.message || 'Error al cargar la propiedad'
  } finally {
    isLoading.value = false
  }
}

// Funciones de navegación de imágenes
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

const previousImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

// Funciones del modal
const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  document.body.style.overflow = 'auto'
}

// Cargar en mount
onMounted(() => {
  loadProperty()
})

// Navegar con teclado
const handleKeydown = (event) => {
  if (event.key === 'ArrowRight') nextImage()
  if (event.key === 'ArrowLeft') previousImage()
  if (event.key === 'Escape') closeModal()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.property-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.detail-container {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 1rem;
  color: var(--color-text-light);
  text-align: center;
}

.loading-state .spinner {
  font-size: 3rem;
  animation: spin 1s linear infinite;
  color: var(--color-primary);
}

.error-state {
  color: #dc2626;
}

.error-state .btn-back-home {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.error-state .btn-back-home:hover {
  background: #0d7599;
}

.property-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
}

/* Galería de imágenes */
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 1rem;
  overflow: hidden;
  background: #f3f4f6;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.main-image-container:hover .main-image {
  transform: scale(1.02);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  z-index: 10;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.nav-button.prev {
  left: 1rem;
}

.nav-button.next {
  right: 1rem;
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.thumbnail {
  width: 100%;
  aspect-ratio: 1;
  border: 3px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #f3f4f6;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: var(--color-secondary);
}

.thumbnail.active {
  border-color: var(--color-primary);
}

/* Sección de información */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.property-title {
  margin: 0;
  font-size: 2rem;
  color: var(--color-text);
  line-height: 1.2;
}

.property-code {
  margin: 0.5rem 0 0 0;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

.status-badge {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  white-space: nowrap;
}

.badge-venta {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-arriendo {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

/* Precio */
.price-section {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.price-section .label {
  display: block;
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-primary);
  font-weight: 700;
}

.price-period {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

/* Ubicación */
.location-section {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  color: var(--color-text);
}

.location-section .material-icons {
  color: var(--color-primary);
  flex-shrink: 0;
}

.location-section p {
  margin: 0;
  font-size: 0.95rem;
}

.location-section p:first-child {
  font-weight: 600;
}

/* Detalles */
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.detail-item:hover {
  border-color: var(--color-primary);
  background: #f9fafb;
}

.detail-item .material-icons {
  color: var(--color-primary);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.detail-item .label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.detail-item p {
  margin: 0;
  font-weight: 600;
  color: var(--color-text);
}

/* Descripción */
.description-section {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.description-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text);
}

.description-section p {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Comodidades */
.amenities-section {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.amenities-section h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-text);
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.amenity-item {
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.95rem;
}

/* Contacto */
.contact-section {
  display: flex;
  gap: 1rem;
}

.btn-contact {
  flex: 1;
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-contact:hover {
  background: #0d7599;
  transform: translateY(-2px);
}

/* Animaciones */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal de imagen */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 1001;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  transition: all 0.3s ease;
  z-index: 1001;
}

.modal-nav-button:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateY(-50%) scale(1.1);
}

.modal-nav-button.prev {
  left: 20px;
}

.modal-nav-button.next {
  right: 20px;
}

.modal-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  z-index: 1001;
}

.image-counter {
  color: white;
  font-size: 0.95rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .property-content {
    grid-template-columns: 1fr;
  }

  .property-title {
    font-size: 1.5rem;
  }

  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 1rem;
  }

  .property-title {
    font-size: 1.25rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .main-image-container {
    aspect-ratio: 3/2;
  }

  .thumbnails {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .amenities-grid {
    grid-template-columns: 1fr;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .nav-button.prev {
    left: 0.5rem;
  }

  .nav-button.next {
    right: 0.5rem;
  }
}
</style>