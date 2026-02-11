<template>
  <section id="proyectos" class="projects-section">
    <div class="container">
      <!-- Encabezado de la sección -->
      <div class="section-header">
        <h2 class="section-title">Proyectos Sobre Planos</h2>
        <p class="section-subtitle">
          Proyectos innovadores y diseñados para mejorar tu estilo de vida
        </p>
      </div>

      <!-- Grid de proyectos -->
      <div v-if="loading" class="loading-state">
        <Icon name="refresh" custom-class="spinner" />
        <p>Cargando proyectos...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon name="error_outline" custom-class="error-icon" />
        <h3>Error al cargar proyectos</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="projects.length > 0" class="projects-list">
        <div v-for="(project, index) in projects" :key="project.id" class="project-row" :class="{ 'reverse': index % 2 === 1 }">
          <!-- Imagen del proyecto -->
          <div class="project-image-col">
            <div class="image-container">
              <img 
                :src="project.imageUrl || placeholderImage" 
                :alt="project.name"
                class="project-image"
                @click="openGallery(project)"
              >
              <button class="btn-expand" @click="openGallery(project)" title="Ver galería">
                <Icon name="fullscreen" />
              </button>
            </div>
          </div>

          <!-- Información del proyecto -->
          <div class="project-info-col">
            <div class="project-info">
              <h3 class="project-title">{{ project.name }}</h3>
              
              <p v-if="project.slogan" class="project-slogan">{{ project.slogan }}</p>
              
              <p class="project-description">{{ project.description }}</p>
              
              <!-- Información con bullets -->
              <div v-if="project.information" class="project-features">
                <h4 class="features-title">Características</h4>
                <ul class="features-list">
                  <li v-for="(feature, i) in parseFeatures(project.information)" :key="i">
                    <Icon name="check_circle" custom-class="feature-icon" />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Botón de acción -->
              <div class="project-actions">
                <button class="share-icon-btn" @click="contactProject(project)" title="Contactar este proyecto">
                  <img src="/white-whatsapp.png" alt="WhatsApp" class="share-wa-icon">
                </button>
                <span>Contactar este Proyecto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <Icon name="folder_off" custom-class="empty-icon" />
        <h3>No hay proyectos disponibles</h3>
        <p>Próximamente contaremos con nuevos desarrollos</p>
      </div>
    </div>
  </section>

  <!-- Modal de galería de imágenes -->
  <Teleport to="body" v-if="selectedProject">
    <div class="modal-overlay" @click="closeGallery">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeGallery">
          <Icon name="close" />
        </button>

        <div class="modal-inner">
          <!-- Columna izquierda: Galería -->
          <div class="modal-gallery-section">
            <div class="main-image-wrapper">
              <img 
                :src="galleryImages[currentImageIndex] || placeholderImage" 
                :alt="`${selectedProject.name} - Imagen ${currentImageIndex + 1}`"
                class="main-image"
              >
              <div class="image-counter">{{ currentImageIndex + 1 }} / {{ galleryImages.length }}</div>

              <!-- Navegación -->
              <div v-if="galleryImages.length > 1" class="gallery-nav">
                <button class="nav-btn" @click="previousImage" title="Imagen anterior">
                  <Icon name="chevron_left" />
                </button>
                <button class="nav-btn" @click="nextImage" title="Siguiente imagen">
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>

            <!-- Miniaturas -->
            <div v-if="galleryImages.length > 1" class="thumbnails">
              <button
                v-for="(image, index) in galleryImages"
                :key="index"
                class="thumbnail"
                :class="{ active: currentImageIndex === index }"
                @click="currentImageIndex = index"
              >
                <img :src="image" :alt="`Thumbnail ${index + 1}`">
              </button>
            </div>
          </div>

          <!-- Columna derecha: Información del proyecto -->
          <div class="modal-info-section">
            <div class="modal-info-content">
              <h2 class="modal-title">{{ selectedProject.name }}</h2>
              <p v-if="selectedProject.slogan" class="modal-slogan">{{ selectedProject.slogan }}</p>
              <p class="modal-description">{{ selectedProject.description }}</p>
              
              <div v-if="selectedProject.information" class="modal-features">
                <h4 class="modal-features-title">Características</h4>
                <ul class="modal-features-list">
                  <li v-for="(feature, i) in parseFeatures(selectedProject.information)" :key="i">
                    <Icon name="check_circle" custom-class="feature-check" />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button class="btn-modal-whatsapp" @click="contactProject(selectedProject)">
              <img src="/whatsapp-button.png" alt="Contactar por WhatsApp" class="whatsapp-btn-img">
               <span>Contactar este Proyecto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
// Imagen placeholder
const placeholderImage = '/property-img.jpg'

// Estado reactivo
const projects = ref([])
const loading = ref(true)
const error = ref(null)
const selectedProject = ref(null)
const currentImageIndex = ref(0)
const galleryImages = ref([])

// Composables
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

// Cargar proyectos desde Supabase
const loadProjects = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: supabaseError } = await supabase
      .from('projects')
      .select('id, name, description, slogan, information, contact, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (supabaseError) {
      console.error('❌ Error al cargar proyectos:', supabaseError)
      error.value = 'No se pudieron cargar los proyectos'
      return
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay proyectos disponibles')
      projects.value = []
      return
    }

    // Obtener imágenes destacadas para cada proyecto
    const projectsWithImages = await Promise.all(
      data.map(async (project) => {
        const { data: imageData } = await supabase
          .from('projects_images')
          .select('url_image')
          .eq('project_id', project.id)
          .eq('main', true)
          .single()

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          slogan: project.slogan,
          information: project.information,
          contact: project.contact,
          is_active: project.is_active,
          imageUrl: imageData?.url_image || placeholderImage
        }
      })
    )

    projects.value = projectsWithImages
    console.log('✅ Proyectos cargados:', projectsWithImages.length)
  } catch (err) {
    console.error('❌ Error en loadProjects:', err)
    error.value = 'Error al cargar los proyectos'
  } finally {
    loading.value = false
  }
}

// Parsear características (separadas por coma o barra)
const parseFeatures = (text) => {
  if (!text) return []
  return text.split(/[,|]/).map(feature => feature.trim()).filter(f => f)
}

// Abrir galería de imágenes
const openGallery = async (project) => {
  selectedProject.value = project
  currentImageIndex.value = 0
  
  // Cargar todas las imágenes del proyecto
  try {
    const { data: imagesData } = await supabase
      .from('projects_images')
      .select('url_image')
      .eq('project_id', project.id)
      .order('main', { ascending: false })

    if (imagesData && imagesData.length > 0) {
      galleryImages.value = imagesData.map(img => img.url_image)
    } else {
      galleryImages.value = [project.imageUrl]
    }
  } catch (err) {
    console.error('Error cargando galería:', err)
    galleryImages.value = [project.imageUrl]
  }
}

// Navegación de galería
const previousImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? galleryImages.value.length - 1 
    : currentImageIndex.value - 1
}

const nextImage = () => {
  currentImageIndex.value = currentImageIndex.value === galleryImages.value.length - 1 
    ? 0 
    : currentImageIndex.value + 1
}

// Cerrar galería
const closeGallery = () => {
  selectedProject.value = null
  galleryImages.value = []
  currentImageIndex.value = 0
}

// Contactar sobre el proyecto por WhatsApp
const contactProject = (project) => {
  const phone = project.contact ? '57' + String(project.contact).replace(/\D/g, '') : '573001234567'
  const message = encodeURIComponent(
    `Hola, me interesa saber más sobre el proyecto "${project.name}". Muchas gracias.`
  )
  if (process.client) {
    window.open(
      `https://wa.me/${phone}?text=${message}`,
      '_blank'
    )
  }
}

// Truncar texto (no usado en la nueva vista, pero dejarlo para compatibilidad)
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Lifecycle
onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.projects-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(11, 97, 130, 0.1);
  color: #0b6182;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e1e1c;
  margin: 1rem 0 0.5rem 0;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #585857;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-bottom: 3rem;
}

.project-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.project-row.reverse {
  direction: rtl;
}

.project-row.reverse > * {
  direction: ltr;
}

.project-image-col {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  height: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: #f0f0f0;
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.project-image-col:hover .project-image {
  transform: scale(1.05);
}

.btn-expand {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #0b6182;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-expand:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.project-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e1e1c;
  margin: 0;
}

.project-slogan {
  font-size: 1.1rem;
  color: #0b6182;
  font-weight: 600;
  margin: 0;
}

.project-description {
  font-size: 1rem;
  color: #585857;
  line-height: 1.8;
  margin: 0;
}

.project-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.features-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0.5rem 0 0 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.6;
}

.features-list li:before {
  content: "✓";
  color: #0b6182;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.project-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.project-actions span{
  color: #0b6182;
  font-weight: 600;
  padding-top: 0.54rem;
}

.btn-whatsapp-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  width: fit-content;
  padding: 1rem 1.75rem;
  background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
}

.btn-whatsapp-main:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
}

.btn-whatsapp-main:active {
  transform: translateY(-1px);
}

/* Estados de carga y error */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.spinner {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: #0b6182;
  animation: spin 1s linear infinite;
}

.share-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0b6182;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-icon-btn:hover {
  background: #094d68;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(11, 97, 130, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #dc2626;
}

.error-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: #dc2626;
}

.error-state h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 5rem;
  display: block;
  margin-bottom: 1rem;
  color: #82bad3;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

/* Galería Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
  cursor: pointer;
}

.modal-overlay:click {
  animation: none;
}

.modal-content {
  background: white;
  border-radius: 1.5rem;
  width: 90vw;
  max-width: 1200px;
  height: 80vh;
  max-height: 700px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  cursor: auto;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: white;
  border: none;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  color: #0b6182;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-close:hover {
  background: #f0f0f0;
  transform: rotate(90deg);
}

.modal-inner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  height: 100%;
  overflow: hidden;
  padding: 2rem;
}

.modal-gallery-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.main-image-wrapper {
  position: relative;
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 1rem;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center center;
}

.image-counter {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #0b6182;
  transition: all 0.3s ease;
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.thumbnails {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  justify-content: flex-start;
}

.thumbnails::-webkit-scrollbar {
  height: 6px;
}

.thumbnails::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background: #0b6182;
  border-radius: 3px;
}

.thumbnail {
  width: 70px;
  height: 70px;
  border-radius: 0.5rem;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: #0b6182;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #0b6182;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #0b6182;
}

.modal-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.modal-info-section::-webkit-scrollbar {
  width: 6px;
}

.modal-info-section::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.modal-info-section::-webkit-scrollbar-thumb {
  background: #0b6182;
  border-radius: 3px;
}

.modal-info-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e1e1c;
  margin: 0;
  line-height: 1.3;
}

.modal-slogan {
  font-size: 1.05rem;
  color: #0b6182;
  font-weight: 600;
  margin: 0;
}

.modal-description {
  font-size: 0.95rem;
  color: #585857;
  line-height: 1.7;
  margin: 0;
}

.modal-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-features-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0.5rem 0 0 0;
}

.modal-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.modal-features-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.5;
}

.feature-check {
  color: #0b6182;
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.btn-modal-whatsapp {
  width: 100%;
  max-width: 300px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: auto;
  text-align: left;
  transition: transform 0.3s ease;
  color: #0b6182;
}
.btn-modal-whatsapp span {
  margin-left: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
}

.whatsapp-btn-img {
  width: 100%;
  max-width: 70px;
  height: auto;

}

.btn-modal-whatsapp:hover {
  transform: scale(1.03);
}

.btn-modal-whatsapp:active {
  transform: scale(0.98);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
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
  .project-row {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .project-row.reverse {
    direction: ltr;
  }

  .project-row.reverse > * {
    direction: ltr;
  }

  .project-image-col {
    height: 300px;
  }

  .modal-content {
    width: 95vw;
    max-width: 900px;
    height: 85vh;
  }

  .modal-inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .modal-gallery-section {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .projects-section {
    padding: 3rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .projects-list {
    gap: 3rem;
  }

  .project-row {
    gap: 1.5rem;
  }

  .project-image-col {
    height: 250px;
    border-radius: 0.75rem;
  }

  .btn-expand {
    width: 3rem;
    height: 3rem;
    bottom: 1rem;
    right: 1rem;
    font-size: 1.25rem;
  }

  .project-title {
    font-size: 1.5rem;
  }

  .project-slogan {
    font-size: 1rem;
  }

  .project-description {
    font-size: 0.95rem;
  }

  .features-list li {
    font-size: 0.9rem;
  }

  .btn-whatsapp-main {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
  }

  .project-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-content {
    width: 98vw;
    height: 90vh;
    max-width: 600px;
    border-radius: 1.5rem 1.5rem 1.5rem 1.5rem;
  }

  .modal-close {
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }

  .modal-inner {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.5rem 1rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-slogan {
    font-size: 1rem;
  }

  .modal-description {
    font-size: 0.9rem;
  }

  .image-counter {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }

  .thumbnails {
    gap: 0.5rem;
  }

  .thumbnail {
    width: 60px;
    height: 60px;
  }

  .modal-info-section {
    gap: 1rem;
  }

  .whatsapp-btn-img {
    max-width: 70px;
  }
}
</style>
g