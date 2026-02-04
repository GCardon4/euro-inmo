<template>
  <div class="agents-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Agentes Inmobiliarios</h1>
        <p>Gestiona los agentes de la empresa</p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <span>➕</span>
        <span>Nuevo Agente</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <p>Cargando agentes...</p>
    </div>

    <!-- Grid de agentes -->
    <div v-else-if="agents.length > 0" class="agents-grid">
      <div v-for="agent in agents" :key="agent.id" class="agent-card">
        <div class="agent-image">
          <img :src="agent.photo_url || 'https://via.placeholder.com/150'" :alt="agent.name">
        </div>
        <div class="agent-info">
          <h3>{{ agent.name }}</h3>
          <p class="role">{{ agent.role || 'Asesor Inmobiliario' }}</p>
          <div class="contact-info">
            <p v-if="agent.email">✉️ {{ agent.email }}</p>
            <p v-if="agent.phone">📞 {{ agent.phone }}</p>
          </div>
          <div class="agent-actions">
            <button @click="editAgent(agent)" class="btn-edit">Editar</button>
            <button @click="deleteAgent(agent)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <span class="empty-icon">👥</span>
      <h3>No hay agentes registrados</h3>
      <p>Comienza agregando el primer agente</p>
      <button @click="showCreateModal = true" class="btn-primary">
        Crear Agente
      </button>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showCreateModal || editingAgent" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingAgent ? 'Editar Agente' : 'Nuevo Agente' }}</h2>
        
        <form @submit.prevent="saveAgent" class="agent-form">
          <div class="form-group">
            <label>Nombre Completo*</label>
            <input v-model="formData.name" type="text" required>
          </div>

          <div class="form-group">
            <label>Rol/Cargo</label>
            <input v-model="formData.role" type="text" placeholder="Asesor Inmobiliario">
          </div>

          <div class="form-group">
            <label>Email*</label>
            <input v-model="formData.email" type="email" required>
          </div>

          <div class="form-group">
            <label>Teléfono*</label>
            <input v-model="formData.phone" type="tel" required>
          </div>

          <div class="form-group">
            <label>WhatsApp</label>
            <input v-model="formData.whatsapp" type="text" placeholder="+57 300 123 4567">
          </div>

          <div class="form-group">
            <label>URL de Foto</label>
            <input v-model="formData.photo_url" type="url" placeholder="https://...">
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

useHead({
  title: 'Agentes - Admin'
})

const supabase = useSupabaseClient()

// Estados
const loading = ref(false)
const saving = ref(false)
const agents = ref([])
const showCreateModal = ref(false)
const editingAgent = ref(null)
const formData = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  whatsapp: '',
  photo_url: '',
  description: ''
})
const { notify, confirmDialog } = useNotification()

// Cargar agentes
const loadAgents = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    agents.value = data || []
  } catch (error) {
    console.error('Error al cargar agentes:', error)
  } finally {
    loading.value = false
  }
}

// Editar agente
const editAgent = (agent) => {
  editingAgent.value = agent
  formData.value = { ...agent }
}

// Guardar agente
const saveAgent = async () => {
  saving.value = true
  try {
    if (editingAgent.value) {
      // Actualizar
      const { error } = await supabase
        .from('profiles')
        .update(formData.value)
        .eq('id', editingAgent.value.id)

      if (error) throw error
      notify('Agente actualizado exitosamente')
    } else {
      // Crear
      const { error } = await supabase
        .from('profiles')
        .insert([formData.value])

      if (error) throw error
      notify('Agente creado exitosamente')
    }

    closeModal()
    await loadAgents()
  } catch (error) {
    console.error('Error al guardar:', error)
    notify('Error al guardar el agente', 'error')
  } finally {
    saving.value = false
  }
}

// Eliminar agente
const deleteAgent = async (agent) => {
  const ok = await confirmDialog(`¿Eliminar a ${agent.name}?`)
  if (!ok) return

  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', agent.id)

    if (error) throw error
    notify('Agente eliminado exitosamente')
    await loadAgents()
  } catch (error) {
    console.error('Error al eliminar:', error)
    notify('Error al eliminar el agente', 'error')
  }
}

// Cerrar modal
const closeModal = () => {
  showCreateModal.value = false
  editingAgent.value = null
  formData.value = {
    name: '',
    role: '',
    email: '',
    phone: '',
    whatsapp: '',
    photo_url: '',
    description: ''
  }
}

onMounted(() => {
  loadAgents()
})
</script>

<style scoped>
.agents-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.agent-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.agent-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
}

.agent-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agent-info {
  padding: 1.5rem;
}

.agent-info h3 {
  font-size: 1.25rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.role {
  color: #2563eb;
  font-weight: 600;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.contact-info {
  margin-bottom: 1rem;
}

.contact-info p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.agent-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #111827;
}

.agent-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-secondary {
  flex: 1;
  padding: 0.875rem;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #d1d5db;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }
}
</style>
