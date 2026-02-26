<template>
  <div class="amenities-page">
    <div class="page-header">
      <div>
        <h1>Atributos de Propiedades</h1>
        <p>Gestiona las atributos: Piscina, Jardín, Parqueadero, etc.</p>
      </div>
      <button @click="showModal = true" class="btn-primary">
        <span>➕</span>
        <span>Nueva Comodidad</span>
      </button>
    </div>

    <div v-if="loading" class="loading-state">Cargando...</div>

    <div v-else class="amenities-grid">
      <div v-for="amenity in amenities" :key="amenity.id" class="amenity-card">
        <div class="amenity-icon">✨</div>
        <h3>{{ amenity.name }}</h3>
        <div class="card-actions">
          <button @click="editAmenity(amenity)" class="btn-edit">Editar</button>
          <button @click="deleteAmenity(amenity)" class="btn-delete">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal || editingItem" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingItem ? 'Editar Comodidad' : 'Nueva Comodidad' }}</h2>
        <form @submit.prevent="saveAmenity">
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="formData.name" required placeholder="Ej: Piscina">
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
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

useHead({ title: 'Atributos - Admin' })

const supabase = useSupabaseClient()
const loading = ref(false)
const amenities = ref([])
const showModal = ref(false)
const editingItem = ref(null)
const formData = ref({ name: '' })
const { notify, confirmDialog } = useNotification()

const loadAmenities = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('name')
    if (error) throw error
    amenities.value = data || []
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const editAmenity = (item) => {
  editingItem.value = item
  formData.value = { ...item }
}

const saveAmenity = async () => {
  try {
    if (editingItem.value) {
      const { error } = await supabase
        .from('amenities')
        .update(formData.value)
        .eq('id', editingItem.value.id)
      if (error) throw error
      notify('Comodidad actualizada')
    } else {
      const { error } = await supabase
        .from('amenities')
        .insert([formData.value])
      if (error) throw error
      notify('Comodidad creada')
    }
    closeModal()
    await loadAmenities()
  } catch (error) {
    console.error('Error:', error)
    notify('Error al guardar', 'error')
  }
}

const deleteAmenity = async (item) => {
  const ok = await confirmDialog(`¿Eliminar "${item.name}"?`)
  if (!ok) return
  try {
    const { error } = await supabase
      .from('amenities')
      .delete()
      .eq('id', item.id)
    if (error) throw error
    notify('Comodidad eliminada')
    await loadAmenities()
  } catch (error) {
    console.error('Error:', error)
    notify('Error al eliminar', 'error')
  }
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  formData.value = { name: '' }
}

onMounted(() => loadAmenities())
</script>

<style scoped>
.amenities-page { max-width: 1400px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; color: #111827; margin: 0 0 0.25rem 0; }
.page-header p { color: #6b7280; margin: 0; }
.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #1d4ed8; }
.loading-state { text-align: center; padding: 4rem; background: white; border-radius: 0.75rem; }
.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
.amenity-card { background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); text-align: center; transition: all 0.3s ease; }
.amenity-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.amenity-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.amenity-card h3 { font-size: 1.1rem; color: #111827; margin: 0 0 1rem 0; }
.card-actions { display: flex; gap: 0.5rem; }
.btn-edit, .btn-delete { flex: 1; padding: 0.5rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
.btn-edit { background: #dbeafe; color: #1e40af; }
.btn-delete { background: #fee2e2; color: #991b1b; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
.modal-content { background: white; border-radius: 0.75rem; padding: 2rem; max-width: 450px; width: 100%; }
.modal-content h2 { margin: 0 0 1.5rem 0; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #374151; }
.form-group input { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
.btn-secondary { flex: 1; padding: 0.875rem; background: #e5e7eb; color: #374151; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
</style>
