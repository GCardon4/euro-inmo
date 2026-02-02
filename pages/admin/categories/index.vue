<template>
  <div class="categories-page">
    <div class="page-header">
      <div>
        <h1>Categorías de Propiedades</h1>
        <p>Gestiona las categorías: Apartamento, Casa, Finca, Local, Lote</p>
      </div>
      <button @click="showModal = true" class="btn-primary">
        <span>➕</span>
        <span>Nueva Categoría</span>
      </button>
    </div>

    <div v-if="loading" class="loading-state">Cargando...</div>

    <div v-else class="categories-grid">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-icon">📂</div>
        <h3>{{ category.name }}</h3>
        <p v-if="category.description">{{ category.description }}</p>
        <div class="card-actions">
          <button @click="editCategory(category)" class="btn-edit">Editar</button>
          <button @click="deleteCategory(category)" class="btn-delete">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal || editingItem" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingItem ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="formData.description" rows="3"></textarea>
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

useHead({ title: 'Categorías - Admin' })

const supabase = useSupabaseClient()
const loading = ref(false)
const categories = ref([])
const showModal = ref(false)
const editingItem = ref(null)
const formData = ref({ name: '', description: '' })

const loadCategories = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .order('name')
    if (error) throw error
    categories.value = data || []
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const editCategory = (item) => {
  editingItem.value = item
  formData.value = { ...item }
}

const saveCategory = async () => {
  try {
    if (editingItem.value) {
      const { error } = await supabase
        .from('category')
        .update(formData.value)
        .eq('id', editingItem.value.id)
      if (error) throw error
      alert('Categoría actualizada')
    } else {
      const { error } = await supabase
        .from('category')
        .insert([formData.value])
      if (error) throw error
      alert('Categoría creada')
    }
    closeModal()
    await loadCategories()
  } catch (error) {
    console.error('Error:', error)
    alert('Error al guardar')
  }
}

const deleteCategory = async (item) => {
  if (!confirm(`¿Eliminar "${item.name}"?`)) return
  try {
    const { error } = await supabase
      .from('category')
      .delete()
      .eq('id', item.id)
    if (error) throw error
    alert('Categoría eliminada')
    await loadCategories()
  } catch (error) {
    console.error('Error:', error)
    alert('Error al eliminar')
  }
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  formData.value = { name: '', description: '' }
}

onMounted(() => loadCategories())
</script>

<style scoped>
.categories-page { max-width: 1400px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; color: #111827; margin: 0 0 0.25rem 0; }
.page-header p { color: #6b7280; margin: 0; }
.btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #1d4ed8; }
.loading-state { text-align: center; padding: 4rem; background: white; border-radius: 0.75rem; }
.categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
.category-card { background: white; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); text-align: center; transition: all 0.3s ease; }
.category-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.category-icon { font-size: 3rem; margin-bottom: 1rem; }
.category-card h3 { font-size: 1.25rem; color: #111827; margin: 0 0 0.5rem 0; }
.category-card p { color: #6b7280; font-size: 0.9rem; margin: 0 0 1rem 0; }
.card-actions { display: flex; gap: 0.5rem; }
.btn-edit, .btn-delete { flex: 1; padding: 0.5rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; }
.btn-edit { background: #dbeafe; color: #1e40af; }
.btn-delete { background: #fee2e2; color: #991b1b; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
.modal-content { background: white; border-radius: 0.75rem; padding: 2rem; max-width: 500px; width: 100%; }
.modal-content h2 { margin: 0 0 1.5rem 0; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #374151; }
.form-group input, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
.btn-secondary { flex: 1; padding: 0.875rem; background: #e5e7eb; color: #374151; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
</style>
