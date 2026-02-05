<template>
  <div class="projects-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Proyectos</h1>
        <p>Gestiona todos los proyectos inmobiliarios</p>
      </div>
      <NuxtLink to="/admin/projects/create" class="btn-primary">
        <span>➕</span>
        <span>Nuevo Proyecto</span>
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre..."
        class="search-input"
      >
      <select v-model="filterActive" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="true">Activos</option>
        <option value="false">Inactivos</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <p>Cargando proyectos...</p>
    </div>

    <!-- Tabla de proyectos -->
    <div v-else-if="filteredProjects.length > 0" class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Creado</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project.id">
            <td class="project-name">{{ project.name }}</td>
            <td class="description">{{ truncateText(project.description, 50) }}</td>
            <td>
              <span v-if="projectImages[project.id]" class="badge badge-image">
                ✓ Imagen
              </span>
              <span v-else class="badge badge-no-image">
                Sin imagen
              </span>
            </td>
            <td class="date">{{ formatDate(project.created_at) }}</td>
            <td>
              <span class="status-indicator" :class="project.is_active ? 'active' : 'inactive'">
                {{ project.is_active ? 'Sí' : 'No' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editProject(project.id)" class="btn-action btn-edit" title="Editar">
                  ✏️
                </button>
                <button @click="deleteProject(project)" class="btn-action btn-delete" title="Eliminar">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <span class="empty-icon">🏗️</span>
      <h3>No hay proyectos</h3>
      <p>Comienza agregando tu primer proyecto</p>
      <NuxtLink to="/admin/projects/create" class="btn-primary">
        Crear Proyecto
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Composables
const supabase = useSupabaseClient()
const router = useRouter()
const { notify } = useNotification()
const { confirmDialog } = useNotification()

// Estado reactivo
const projects = ref([])
const projectImages = ref({})
const loading = ref(true)
const searchQuery = ref('')
const filterActive = ref('')

// Cargar proyectos
const loadProjects = async () => {
  try {
    loading.value = true

    // Obtener proyectos
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, description, created_at, is_active')
      .order('created_at', { ascending: false })

    if (projectsError) {
      console.error('❌ Error al cargar proyectos:', projectsError)
      return
    }

    projects.value = projectsData || []

    // Cargar imágenes principales para cada proyecto
    for (const project of projects.value) {
      const { data: imageData } = await supabase
        .from('projects_images')
        .select('id')
        .eq('project_id', project.id)
        .eq('main', true)
        .single()

      if (imageData) {
        projectImages.value[project.id] = true
      }
    }

    console.log('✅ Proyectos cargados:', projects.value.length)
  } catch (err) {
    console.error('❌ Error en loadProjects:', err)
  } finally {
    loading.value = false
  }
}

// Proyectos filtrados
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesActive = filterActive.value === '' || 
                         project.is_active.toString() === filterActive.value

    return matchesSearch && matchesActive
  })
})

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Truncar texto
const truncateText = (text, length) => {
  if (!text) return '-'
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Editar proyecto
const editProject = (projectId) => {
  router.push(`/admin/projects/edit/${projectId}`)
}

// Eliminar proyecto
const deleteProject = async (project) => {
  const ok = await confirmDialog(`¿Eliminar el proyecto "${project.name}"?`, 'Confirmar eliminación')
  if (!ok) return

  try {
    // Eliminar imágenes primero
    const { error: imagesError } = await supabase
      .from('projects_images')
      .delete()
      .eq('project_id', project.id)

    if (imagesError) {
      console.error('❌ Error al eliminar imágenes:', imagesError)
      notify('Error al eliminar las imágenes del proyecto', 'error')
      return
    }

    // Eliminar proyecto
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (projectError) {
      console.error('❌ Error al eliminar proyecto:', projectError)
      notify('Error al eliminar el proyecto', 'error')
      return
    }

    // Actualizar lista
    projects.value = projects.value.filter(p => p.id !== project.id)
    notify('Proyecto eliminado exitosamente')
    console.log('✅ Proyecto eliminado:', project.name)
  } catch (err) {
    console.error('❌ Error en deleteProject:', err)
    notify('Error al eliminar el proyecto', 'error')
  }
}

// Lifecycle
onMounted(() => {
  loadProjects()
})

// Configurar layout
definePageMeta({
  layout: 'admin'
})

// SEO
useSeoMeta({
  title: 'Proyectos - Admin',
  robots: 'noindex'
})
</script>

<style scoped>
.projects-page {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #1e1e1c;
}

.page-header p {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0b6182;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary:hover {
  background: #082f3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 97, 130, 0.3);
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input,
.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #0b6182;
  box-shadow: 0 0 0 3px rgba(11, 97, 130, 0.1);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  color: #6b7280;
}

.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f3f4f6;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1e1e1c;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.project-name {
  font-weight: 600;
  max-width: 200px;
}

.description {
  color: #6b7280;
  font-size: 0.9rem;
  max-width: 300px;
}

.date {
  font-size: 0.9rem;
  color: #6b7280;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-image {
  background: #d1fae5;
  color: #065f46;
}

.badge-no-image {
  background: #fee2e2;
  color: #991b1b;
}

.status-indicator {
  display: inline-block;
  width: 2rem;
  text-align: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-indicator.active {
  background: #d1fae5;
  color: #065f46;
}

.status-indicator.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #e0f2fe;
  color: #0369a1;
}

.btn-edit:hover {
  background: #0369a1;
  color: white;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #991b1b;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #1e1e1c;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #6b7280;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }

  .data-table {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem;
  }
}
</style>
