<template>
  <div class="locations-page">
    <div class="page-header">
      <div>
        <h1>Ubicaciones</h1>
        <p>Gestiona departamentos, ciudades y zonas</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="['tab-btn', { active: activeTab === tab.value }]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Departamentos -->
    <div v-if="activeTab === 'states'" class="tab-content">
      <div class="section-header">
        <h2>Departamentos</h2>
        <button @click="showStateModal = true" class="btn-primary">+ Nuevo</button>
      </div>
      <div class="items-list">
        <div v-for="state in states" :key="state.id" class="list-item">
          <span>{{ state.name }}</span>
          <div class="item-actions">
            <button @click="editState(state)" class="btn-edit">Editar</button>
            <button @click="deleteState(state)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ciudades -->
    <div v-if="activeTab === 'cities'" class="tab-content">
      <div class="section-header">
        <h2>Ciudades/Municipios</h2>
        <button @click="showCityModal = true" class="btn-primary">+ Nueva</button>
      </div>
      <div class="items-list">
        <div v-for="city in cities" :key="city.id" class="list-item">
          <div>
            <strong>{{ city.name }}</strong>
            <span class="sub-text">{{ city.state?.name || 'Sin departamento' }}</span>
          </div>
          <div class="item-actions">
            <button @click="editCity(city)" class="btn-edit">Editar</button>
            <button @click="deleteCity(city)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Zonas -->
    <div v-if="activeTab === 'zones'" class="tab-content">
      <div class="section-header">
        <h2>Zonas/Veredas</h2>
        <button @click="showZoneModal = true" class="btn-primary">+ Nueva</button>
      </div>
      <div class="items-list">
        <div v-for="zone in zones" :key="zone.id" class="list-item">
          <div>
            <strong>{{ zone.name }}</strong>
            <span class="sub-text">{{ zone.city?.name || 'Sin ciudad' }}</span>
          </div>
          <div class="item-actions">
            <button @click="editZone(zone)" class="btn-edit">Editar</button>
            <button @click="deleteZone(zone)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Departamento -->
    <div v-if="showStateModal || editingState" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <h2>{{ editingState ? 'Editar' : 'Nuevo' }} Departamento</h2>
        <form @submit.prevent="saveState">
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="stateForm.name" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ciudad -->
    <div v-if="showCityModal || editingCity" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <h2>{{ editingCity ? 'Editar' : 'Nueva' }} Ciudad</h2>
        <form @submit.prevent="saveCity">
          <div class="form-group">
            <label>Departamento*</label>
            <select v-model="cityForm.state_id" required>
              <option value="">Seleccionar...</option>
              <option v-for="state in states" :key="state.id" :value="state.id">
                {{ state.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="cityForm.name" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Zona -->
    <div v-if="showZoneModal || editingZone" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <h2>{{ editingZone ? 'Editar' : 'Nueva' }} Zona</h2>
        <form @submit.prevent="saveZone">
          <div class="form-group">
            <label>Ciudad*</label>
            <select v-model="zoneForm.city_id" required>
              <option value="">Seleccionar...</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Nombre*</label>
            <input v-model="zoneForm.name" required>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
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

useHead({ title: 'Ubicaciones - Admin' })

const supabase = useSupabaseClient()

const activeTab = ref('states')
const tabs = [
  { label: 'Departamentos', value: 'states' },
  { label: 'Ciudades', value: 'cities' },
  { label: 'Zonas', value: 'zones' }
]

const states = ref([])
const cities = ref([])
const zones = ref([])

const showStateModal = ref(false)
const showCityModal = ref(false)
const showZoneModal = ref(false)

const editingState = ref(null)
const editingCity = ref(null)
const editingZone = ref(null)

const stateForm = ref({ name: '' })
const cityForm = ref({ name: '', state_id: '' })
const zoneForm = ref({ name: '', city_id: '' })

// Cargar datos
const loadStates = async () => {
  const { data } = await supabase.from('state').select('*').order('name')
  states.value = data || []
}

const loadCities = async () => {
  const { data } = await supabase.from('city').select('*, state:state_id(*)').order('name')
  cities.value = data || []
}

const loadZones = async () => {
  const { data } = await supabase.from('zone').select('*, city:city_id(*)').order('name')
  zones.value = data || []
}

// CRUD Departamentos
const editState = (item) => {
  editingState.value = item
  stateForm.value = { ...item }
}

const saveState = async () => {
  try {
    if (editingState.value) {
      await supabase.from('state').update(stateForm.value).eq('id', editingState.value.id)
    } else {
      await supabase.from('state').insert([stateForm.value])
    }
    alert('Guardado exitosamente')
    closeModals()
    await loadStates()
  } catch (error) {
    alert('Error al guardar')
  }
}

const deleteState = async (item) => {
  if (!confirm(`¿Eliminar "${item.name}"?`)) return
  await supabase.from('state').delete().eq('id', item.id)
  await loadStates()
}

// CRUD Ciudades
const editCity = (item) => {
  editingCity.value = item
  cityForm.value = { name: item.name, state_id: item.state_id }
}

const saveCity = async () => {
  try {
    if (editingCity.value) {
      await supabase.from('city').update(cityForm.value).eq('id', editingCity.value.id)
    } else {
      await supabase.from('city').insert([cityForm.value])
    }
    alert('Guardado exitosamente')
    closeModals()
    await loadCities()
  } catch (error) {
    alert('Error al guardar')
  }
}

const deleteCity = async (item) => {
  if (!confirm(`¿Eliminar "${item.name}"?`)) return
  await supabase.from('city').delete().eq('id', item.id)
  await loadCities()
}

// CRUD Zonas
const editZone = (item) => {
  editingZone.value = item
  zoneForm.value = { name: item.name, city_id: item.city_id }
}

const saveZone = async () => {
  try {
    if (editingZone.value) {
      await supabase.from('zone').update(zoneForm.value).eq('id', editingZone.value.id)
    } else {
      await supabase.from('zone').insert([zoneForm.value])
    }
    alert('Guardado exitosamente')
    closeModals()
    await loadZones()
  } catch (error) {
    alert('Error al guardar')
  }
}

const deleteZone = async (item) => {
  if (!confirm(`¿Eliminar "${item.name}"?`)) return
  await supabase.from('zone').delete().eq('id', item.id)
  await loadZones()
}

const closeModals = () => {
  showStateModal.value = false
  showCityModal.value = false
  showZoneModal.value = false
  editingState.value = null
  editingCity.value = null
  editingZone.value = null
  stateForm.value = { name: '' }
  cityForm.value = { name: '', state_id: '' }
  zoneForm.value = { name: '', city_id: '' }
}

onMounted(() => {
  loadStates()
  loadCities()
  loadZones()
})
</script>

<style scoped>
.locations-page { max-width: 1400px; }
.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; color: #111827; margin: 0 0 0.25rem 0; }
.page-header p { color: #6b7280; margin: 0; }
.tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; }
.tab-btn { padding: 0.875rem 1.5rem; border: none; background: none; color: #6b7280; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
.tab-content { background: white; padding: 2rem; border-radius: 0.75rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.section-header h2 { font-size: 1.5rem; margin: 0; }
.btn-primary { padding: 0.75rem 1.25rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: #1d4ed8; }
.items-list { display: flex; flex-direction: column; gap: 0.75rem; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
.list-item strong { display: block; color: #111827; }
.sub-text { display: block; font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
.item-actions { display: flex; gap: 0.5rem; }
.btn-edit, .btn-delete { padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; font-size: 0.875rem; }
.btn-edit { background: #dbeafe; color: #1e40af; }
.btn-delete { background: #fee2e2; color: #991b1b; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 0.75rem; padding: 2rem; max-width: 500px; width: 100%; margin: 2rem; }
.modal-content h2 { margin: 0 0 1.5rem 0; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
.form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
.btn-secondary { flex: 1; padding: 0.875rem; background: #e5e7eb; color: #374151; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
</style>
