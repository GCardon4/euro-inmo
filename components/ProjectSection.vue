<template>
  <section class="projects-section">
    <div class="container">
      <!-- Encabezado de la sección -->
      <div class="section-header">
        <span class="section-label">Nuestros Proyectos</span>
        <h2 class="section-title">Desarrollos Inmobiliarios de Calidad</h2>
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

      <div v-else-if="projects.length > 0" class="projects-grid">
        <div v-for="project in projects" :key="project.id" class="project-card">
          <!-- Imagen del proyecto -->
          <div class="project-image-container">
            <img 
              :src="project.imageUrl || placeholderImage" 
              :alt="project.name"
              class="project-image"
            >
            <div class="project-overlay">
              <button class="btn-view-more" @click="viewProjectDetails(project)">
                <Icon name="arrow_forward" />
                <span>Ver más</span>
              </button>
            </div>
          </div>

          <!-- Contenido del proyecto -->
          <div class="project-content">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-description">{{ truncateText(project.description, 150) }}</p>
            <div class="project-footer">
              <button class="btn-learn-more" @click="viewProjectDetails(project)">
                Conocer más
                <Icon name="arrow_forward" custom-class="icon" />
              </button>
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

  <!-- Modal de detalles del proyecto -->
  <Teleport to="body" v-if="selectedProject">
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <Icon name="close" />
        </button>

        <div class="modal-image">
          <img 
            :src="selectedProject.imageUrl || placeholderImage" 
            :alt="selectedProject.name"
          >
        </div>

        <div class="modal-body">
          <h2 class="modal-title">{{ selectedProject.name }}</h2>
          <p class="modal-description">{{ selectedProject.description }}</p>

          <div class="modal-footer">
            <button class="btn-contact" @click="contactAboutProject(selectedProject)">
              <Icon name="whatsapp" custom-class="icon" />
              <span>Contactar sobre este proyecto</span>
            </button>
            <button class="btn-close-modal" @click="closeModal">Cerrar</button>
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
      .select('id, name, description')
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

// Truncar texto
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Ver detalles del proyecto
const viewProjectDetails = (project) => {
  selectedProject.value = project
}

// Cerrar modal
const closeModal = () => {
  selectedProject.value = null
}

// Contactar sobre el proyecto
const contactAboutProject = (project) => {
  const message = encodeURIComponent(
    `Quiero saber más sobre el proyecto: ${project.name}. Muchas gracias`
  )
  window.open(
    `https://wa.me/573001234567?text=${message}`,
    '_blank'
  )
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.project-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #f0f0f0;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 97, 130, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.btn-view-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0b6182;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-view-more:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.project-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e1e1c;
  margin: 0 0 0.75rem 0;
}

.project-description {
  font-size: 0.95rem;
  color: #585857;
  line-height: 1.6;
  margin: 0 0 auto 0;
  flex-grow: 1;
}

.project-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-learn-more {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0b6182 0%, #082f3d 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-learn-more:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(11, 97, 130, 0.3);
}

.btn-learn-more .icon {
  font-size: 1rem;
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
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

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 1.5rem;
}

.modal-close:hover {
  background: #f0f0f0;
  transform: rotate(90deg);
}

.modal-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  padding: 2rem;
}

.modal-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e1e1c;
  margin: 0 0 1rem 0;
}

.modal-description {
  font-size: 1rem;
  color: #585857;
  line-height: 1.8;
  margin-bottom: 2rem;
  white-space: pre-wrap;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #25D366;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-contact:hover {
  background: #20BA5A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.btn-contact .icon {
  font-size: 1.25rem;
}

.btn-close-modal {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-close-modal:hover {
  background: #e5e7eb;
}

/* Responsive */
@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-image {
    height: 200px;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.5rem;
  }
}
</style>
