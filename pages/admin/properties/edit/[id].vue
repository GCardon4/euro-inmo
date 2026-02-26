<template>
  <div class="edit-property-page">
    <div class="page-header">
      <div>
        <h1>Editar Propiedad</h1>
        <p class="subtitle">Actualiza la información de la propiedad</p>
      </div>
      <NuxtLink to="/admin/properties" class="btn-back">
        <Icon name="arrow_back" />
        Volver
      </NuxtLink>
    </div>

    <form @submit.prevent="handleSubmit" class="property-form" v-if="!isLoading">
      <!-- Información básica -->
      <div class="form-section">
        <h2 class="section-title">Información Básica</h2>
        
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre de la Propiedad *</label>
            <input 
              v-model="formData.name" 
              type="text" 
              id="name" 
              required
              placeholder="Ej: Apartamento en Rionegro"
            >
          </div>

          <div class="form-group">
            <label for="code">Código *</label>
            <input 
              v-model="formData.code" 
              type="text" 
              id="code" 
              required
              placeholder="Ej: APT-001"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descripción *</label>
          <textarea 
            v-model="formData.description" 
            id="description" 
            rows="5"
            required
            placeholder="Describe las características principales de la propiedad..."
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Categoría *</label>
            <select v-model="formData.category_id" id="category" required>
              <option value="">Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="status">Estado *</label>
            <select v-model="formData.status_id" id="status" required>
              <option value="">Selecciona un estado</option>
              <option v-for="st in statuses" :key="st.id" :value="st.id">
                {{ st.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="price">Precio *</label>
            <input
              :value="displayPrice"
              @input="onPriceInput"
              type="text"
              inputmode="numeric"
              id="price"
              placeholder="Ej: 1.500.000"
            >
          </div>
        </div>
      </div>

      <!-- Ubicación -->
      <div class="form-section">
        <h2 class="section-title">Ubicación</h2>
        
        <div class="form-row">
          <div class="form-group">
            <label for="state">Departamento *</label>
            <select v-model="formData.state_id" id="state" required @change="loadCities">
              <option value="">Selecciona un departamento</option>
              <option v-for="st in states" :key="st.id" :value="st.id">
                {{ st.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="city">Ciudad/Municipio *</label>
            <select v-model="formData.city_id" id="city" required @change="loadZones" :disabled="!formData.state_id">
              <option value="">Selecciona una ciudad</option>
              <option v-for="city in cities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="zone">Zona/Vereda</label>
            <select v-model="formData.zone_id" id="zone" :disabled="!formData.city_id">
              <option value="">Selecciona una zona</option>
              <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Detalles de la Propiedad -->
      <div class="form-section">
        <h2 class="section-title">Detalles de la Propiedad</h2>

        <div class="form-row">
          <div class="form-group">
            <label for="rooms">Habitaciones</label>
            <input
              v-model.number="formData.rooms"
              type="number"
              id="rooms"
              placeholder="Ej: 3"
              min="0"
            >
          </div>

          <div class="form-group">
            <label for="bathrooms">Baños</label>
            <input
              v-model.number="formData.bathrooms"
              type="number"
              id="bathrooms"
              placeholder="Ej: 2"
              min="0"
            >
          </div>

          <div class="form-group">
            <label for="area">Área (m²)</label>
            <input
              v-model.number="formData.area"
              type="number"
              id="area"
              placeholder="Ej: 120"
              min="0"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="kitchen">Cocina</label>
            <input
              v-model.number="formData.kitchen"
              type="number"
              id="kitchen"
              placeholder="Ej: 1"
              min="0"
            >
          </div>

          <div class="form-group">
            <label for="hall">Sala</label>
            <input
              v-model.number="formData.hall"
              type="number"
              id="hall"
              placeholder="Ej: 1"
              min="0"
            >
          </div>

          <div class="form-group">
            <label for="dining">Comedor</label>
            <input
              v-model.number="formData.dining"
              type="number"
              id="dining"
              placeholder="Ej: 1"
              min="0"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="closet">Closet</label>
            <input
              v-model.number="formData.closet"
              type="number"
              id="closet"
              placeholder="Ej: 2"
              min="0"
            >
          </div>

          <div class="form-group">
            <label for="clothing">Zona de Ropas</label>
            <input
              v-model.number="formData.clothing"
              type="number"
              id="clothing"
              placeholder="Ej: 1"
              min="0"
            >
          </div>

          <div class="form-group">
            <label for="gas">Red de Gas</label>
            <input
              v-model.number="formData.gas"
              type="number"
              id="gas"
              placeholder="Ej: 1"
              min="0"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dressing">Vestier</label>
            <input
              v-model.number="formData.dressing"
              type="number"
              id="dressing"
              placeholder="Ej: 1"
              min="0"
            >
          </div>
        </div>
      </div>

      <!-- Atributos -->
      <div class="form-section">
        <h2 class="section-title">Atributos</h2>

        <div v-if="amenitiesLoading" class="loading-text">Cargando atributos...</div>
        <div v-else-if="amenities.length === 0" class="empty-text">No hay atributos registradas</div>
        <div v-else class="amenities-grid">
          <label
            v-for="amenity in amenities"
            :key="amenity.id"
            class="amenity-checkbox"
          >
            <input
              type="checkbox"
              :value="amenity.id"
              v-model="selectedAmenities"
            >
            <span class="amenity-label">
              <span v-if="amenity.icon" class="material-icons amenity-icon">{{ amenity.icon }}</span>
              {{ amenity.name }}
            </span>
          </label>
        </div>
      </div>

      <!-- Galería de Imágenes -->
      <div class="form-section">
        <h2 class="section-title">Galería de Imágenes</h2>
        
        <div v-if="existingImages.length > 0" class="existing-images">
          <h3 class="gallery-subtitle">Imágenes Existentes</h3>
          <div class="image-gallery">
            <div v-for="(image, index) in existingImages" :key="`existing-${image.id}`" class="image-item">
              <img :src="image.url_image" :alt="`Imagen existente ${index + 1}`">
              <div v-if="image.main" class="badge-main">Principal</div>
              <div class="image-actions">
                <button 
                  v-if="!image.main"
                  type="button" 
                  @click="setMainImage(index)" 
                  class="btn-action btn-main" 
                  title="Marcar como principal"
                >
                  <Icon name="star_outline" />
                </button>
                <button 
                  v-else
                  type="button" 
                  class="btn-action btn-main active" 
                  title="Imagen principal"
                  disabled
                >
                  <Icon name="star" />
                </button>
              </div>
              <button type="button" @click="removeExistingImage(index)" class="btn-remove" title="Eliminar imagen">
                <Icon name="delete" />
              </button>
            </div>
          </div>
        </div>

        <div class="image-upload-area">
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            multiple
            style="display: none"
          >
          
          <button type="button" @click="$refs.fileInput.click()" class="btn-upload">
            <Icon name="add_photo_alternate" />
            Seleccionar Imágenes
          </button>

          <div v-if="selectedFiles.length > 0" class="selected-files">
            <p>{{ selectedFiles.length }} archivo(s) seleccionado(s)</p>
          </div>
        </div>

        <div v-if="newImages.length > 0" class="new-images">
          <h3 class="gallery-subtitle">Nuevas Imágenes</h3>
          <div class="image-gallery">
            <div v-for="(image, index) in newImages" :key="`new-${index}`" class="image-item">
              <img :src="image.url" :alt="`Imagen nueva ${index + 1}`">
              <button type="button" @click="removeNewImage(index)" class="btn-remove" title="Eliminar imagen">
                <Icon name="delete" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Opciones Adicionales -->
      <div class="form-section">
        <h2 class="section-title">Opciones Adicionales</h2>
        
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="formData.is_active">
            Propiedad Activa
          </label>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="form-actions">
        <button type="button" @click="$router.push('/admin/properties')" class="btn-cancel">
          Cancelar
        </button>
        <button type="button" @click="handleDelete" class="btn-delete" :disabled="isSubmitting">
          <Icon name="delete" />
          Eliminar
        </button>
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          <Icon v-if="!isSubmitting" name="save" />
          <Icon v-else name="refresh" custom-class="spinning" />
          {{ isSubmitting ? 'Guardando...' : 'Actualizar Propiedad' }}
        </button>
      </div>
    </form>

    <div v-else class="loading-state">
      <Icon name="refresh" custom-class="spinning-large" />
      <p>Cargando propiedad...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const route = useRoute()
const supabase = useSupabaseClient()
const router = useRouter()
const { notify } = useNotification()
const { processPropertyImage } = useImageProcessor()

// Obtener ID de la propiedad desde la ruta
const propertyId = route.params.id

// Estados
const isLoading = ref(true)
const isSubmitting = ref(false)
const categories = ref([])
const statuses = ref([])
const states = ref([])
const cities = ref([])
const zones = ref([])
const selectedFiles = ref([])
const newImages = ref([])
const existingImages = ref([])
const fileInput = ref(null)
const amenities = ref([])
const amenitiesLoading = ref(false)
const selectedAmenities = ref([])
const imagesToDelete = ref([])

// Formateo de precio COP con puntos de miles
const formatCOP = (value) => {
  if (!value && value !== 0) return ''
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseCOP = (formatted) => {
  const cleaned = formatted.replace(/\./g, '').replace(/\D/g, '')
  return cleaned ? parseInt(cleaned) : 0
}

const displayPrice = computed(() => formatCOP(formData.value.price))

const onPriceInput = (e) => {
  formData.value.price = parseCOP(e.target.value)
}

// Formulario
const formData = ref({
  code: '',
  name: '',
  description: '',
  price: 0,
  category_id: '',
  status_id: '',
  state_id: '',
  city_id: '',
  zone_id: '',
  rooms: null,
  bathrooms: null,
  area: null,
  kitchen: null,
  hall: null,
  dining: null,
  closet: null,
  clothing: null,
  gas: null,
  dressing: null,
  is_active: true
})

// Cargar datos iniciales
onMounted(async () => {
  try {
    await Promise.all([
      loadCategories(),
      loadStatuses(),
      loadStates(),
      loadAmenities(),
      loadProperty()
    ])
  } catch (error) {
    console.error('Error cargando datos:', error)
    notify('Error cargando la propiedad', 'error')
    router.push('/admin/properties')
  } finally {
    isLoading.value = false
  }
})

// Cargar propiedad existente
const loadProperty = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single()

  if (error) {
    console.error('Error cargando propiedad:', error)
    throw error
  }

  // Llenar formulario con datos existentes
  formData.value = {
    code: data.code,
    name: data.name,
    description: data.description,
    price: data.price,
    category_id: data.category_id,
    status_id: data.status_id,
    state_id: data.state_id,
    city_id: data.city_id,
    zone_id: data.zone_id,
    rooms: data.rooms,
    bathrooms: data.bathrooms,
    area: data.area,
    kitchen: data.kitchen,
    hall: data.hall,
    dining: data.dining,
    closet: data.closet,
    clothing: data.clothing,
    gas: data.gas,
    dressing: data.dressing,
    is_active: data.is_active
  }

  // Guardar valores de ciudad y zona antes de cargar
  const savedCityId = data.city_id
  const savedZoneId = data.zone_id

  // Cargar ciudades y zonas según ubicación actual
  if (data.state_id) {
    await loadCities()
    // Restaurar city_id después de cargar
    formData.value.city_id = savedCityId
  }
  
  if (savedCityId) {
    await loadZones()
    // Restaurar zone_id después de cargar
    formData.value.zone_id = savedZoneId
  }

  // Cargar imágenes existentes desde properties_images
  const { data: imagesData, error: imagesError } = await supabase
    .from('properties_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('main', { ascending: false })

  if (!imagesError && imagesData) {
    existingImages.value = imagesData
  }

  // Cargar atributos seleccionadas
  const { data: amenityData, error: amenityError } = await supabase
    .from('property_amenities')
    .select('amenity_id')
    .eq('property_id', propertyId)

  if (!amenityError && amenityData) {
    selectedAmenities.value = amenityData.map(a => a.amenity_id)
  }
}

// Cargar categorías
const loadCategories = async () => {
  const { data, error } = await supabase
    .from('category')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error cargando categorías:', error)
    return
  }
  
  categories.value = data || []
}

// Cargar estados (status)
const loadStatuses = async () => {
  const { data, error } = await supabase
    .from('status')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error cargando estados:', error)
    return
  }
  
  statuses.value = data || []
}

// Cargar departamentos
const loadStates = async () => {
  const { data, error } = await supabase
    .from('state')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error cargando departamentos:', error)
    return
  }
  
  states.value = data || []
}

// Cargar ciudades según departamento
const loadCities = async () => {
  if (!formData.value.state_id) {
    cities.value = []
    formData.value.city_id = ''
    return
  }

  const { data, error } = await supabase
    .from('city')
    .select('*')
    .eq('state_id', formData.value.state_id)
    .order('name')
  
  if (error) {
    console.error('Error cargando ciudades:', error)
    return
  }
  
  cities.value = data || []
  // Solo resetear zona si cambió el departamento
  formData.value.zone_id = ''
}

// Cargar zonas según ciudad
const loadZones = async () => {
  if (!formData.value.city_id) {
    zones.value = []
    formData.value.zone_id = ''
    return
  }

  const { data, error } = await supabase
    .from('zone')
    .select('*')
    .eq('city_id', formData.value.city_id)
    .order('name')
  
  if (error) {
    console.error('Error cargando zonas:', error)
    return
  }
  
  zones.value = data || []
  formData.value.zone_id = ''
}

// Cargar atributos disponibles
const loadAmenities = async () => {
  amenitiesLoading.value = true

  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error cargando atributos:', error)
    amenitiesLoading.value = false
    return
  }

  amenities.value = data || []
  amenitiesLoading.value = false
}

// Manejar selección de archivos
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files
  
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      newImages.value.push({
        file,
        url: e.target.result,
        isMain: false
      })
    }
    reader.readAsDataURL(file)
  })
}

// Remover imagen nueva
const removeNewImage = (index) => {
  newImages.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)
}

// Remover imagen existente
const removeExistingImage = (index) => {
  const imageToDelete = existingImages.value[index]
  imagesToDelete.value.push(imageToDelete)
  existingImages.value.splice(index, 1)
}

// Subir nuevas imágenes a Supabase Storage
const uploadNewImages = async (propertyCode) => {
  if (newImages.value.length === 0) return []

  const uploadedUrls = []

  for (let i = 0; i < newImages.value.length; i++) {
    const imageData = newImages.value[i]
    let file = imageData.file

    // Procesar imagen: redimensionar, marca de agua y convertir a WebP
    file = await processPropertyImage(file)

    const fileName = `${Date.now()}_${i}.webp`
    // Ruta: public/{code}/{filename} — requerido por políticas RLS de storage
    const filePath = `public/${propertyCode}/${fileName}`

    const { data, error } = await supabase.storage
      .from('properties')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/webp'
      })

    if (error) {
      console.error('Error subiendo imagen:', error)
      continue
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('properties')
      .getPublicUrl(filePath)

    uploadedUrls.push({
      url: urlData.publicUrl,
      isMain: imageData.isMain
    })
  }

  return uploadedUrls
}

// Extraer el path de storage a partir de la URL pública
const extraerPathStorage = (url) => {
  const marker = '/storage/v1/object/public/properties/'
  const idx = url.indexOf(marker)
  return idx !== -1 ? url.substring(idx + marker.length) : null
}

// Eliminar imágenes de Supabase Storage y BD
const deleteImages = async () => {
  if (imagesToDelete.value.length === 0) return

  for (const imageRecord of imagesToDelete.value) {
    // Eliminar archivo del storage
    const storagePath = extraerPathStorage(imageRecord.url_image)
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('properties')
        .remove([storagePath])

      if (storageError) console.error('Error eliminando imagen de storage:', storageError)
    }

    // Eliminar registro de la BD
    const { error } = await supabase
      .from('properties_images')
      .delete()
      .eq('id', imageRecord.id)

    if (error) console.error('Error eliminando registro de imagen:', error)
  }
}

// Marcar imagen como principal
const setMainImage = async (index) => {
  try {
    const selectedImage = existingImages.value[index]
    
    // Actualizar todas las imágenes de esta propiedad a main: false
    const { error: updateAllError } = await supabase
      .from('properties_images')
      .update({ main: false })
      .eq('property_id', propertyId)

    if (updateAllError) throw updateAllError

    // Establecer la imagen seleccionada como principal
    const { error: updateSelectedError } = await supabase
      .from('properties_images')
      .update({ main: true })
      .eq('id', selectedImage.id)

    if (updateSelectedError) throw updateSelectedError

    // Actualizar el estado local
    existingImages.value.forEach(img => {
      img.main = false
    })
    selectedImage.main = true

    notify('Imagen marcada como principal', 'success')
  } catch (error) {
    console.error('Error marcando imagen como principal:', error)
    notify('Error al marcar imagen como principal', 'error')
  }
}

// Actualizar atributos
const updateAmenities = async () => {
  // Eliminar atributos previas
  const { error: deleteError } = await supabase
    .from('property_amenities')
    .delete()
    .eq('property_id', propertyId)

  if (deleteError) {
    console.error('Error eliminando atributos previas:', deleteError)
  }

  // Insertar nuevas atributos
  if (selectedAmenities.value.length > 0) {
    const amenityRows = selectedAmenities.value.map(amenityId => ({
      property_id: propertyId,
      amenity_id: amenityId
    }))

    const { error: insertError } = await supabase
      .from('property_amenities')
      .insert(amenityRows)

    if (insertError) {
      console.error('Error guardando atributos:', insertError)
    }
  }
}

// Enviar formulario (actualizar)
const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // 1. Eliminar imágenes marcadas para eliminar
    await deleteImages()

    // 2. Subir nuevas imágenes a storage y guardar en properties_images
    const newImageUrls = await uploadNewImages(formData.value.code)
    
    if (newImageUrls.length > 0) {
      const newImageRecords = newImageUrls.map(imageData => ({
        property_id: propertyId,
        url_image: imageData.url,
        main: imageData.isMain,
        code: formData.value.code
      }))

      const { error: imageError } = await supabase
        .from('properties_images')
        .insert(newImageRecords)

      if (imageError) {
        console.error('Error guardando nuevas imágenes:', imageError)
      }
    }

    // 3. Preparar datos de la propiedad
    const priceValue = parseFloat(formData.value.price) || 0
    const propertyData = {
      code: formData.value.code,
      name: formData.value.name,
      description: formData.value.description,
      price: priceValue,
      category_id: formData.value.category_id,
      status_id: formData.value.status_id,
      state_id: formData.value.state_id,
      city_id: formData.value.city_id,
      zone_id: formData.value.zone_id || null,
      rooms: formData.value.rooms || null,
      bathrooms: formData.value.bathrooms || null,
      area: formData.value.area || null,
      kitchen: formData.value.kitchen || null,
      hall: formData.value.hall || null,
      dining: formData.value.dining || null,
      closet: formData.value.closet || null,
      clothing: formData.value.clothing || null,
      gas: formData.value.gas || null,
      dressing: formData.value.dressing || null,
      is_active: formData.value.is_active
    }

    // 4. Actualizar propiedad
    const { error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', propertyId)

    if (error) throw error

    // 5. Actualizar atributos
    await updateAmenities()

    notify('Propiedad actualizada exitosamente')
    router.push('/admin/properties')

  } catch (error) {
    console.error('Error actualizando propiedad:', error)
    notify('Error al actualizar la propiedad: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Eliminar propiedad
const handleDelete = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
    return
  }

  isSubmitting.value = true

  try {
    // 1. Eliminar todas las imágenes de properties_images y del storage
    const { data: allImages } = await supabase
      .from('properties_images')
      .select('*')
      .eq('property_id', propertyId)

    if (allImages && allImages.length > 0) {
      imagesToDelete.value = allImages
      await deleteImages()
    }

    // 2. Eliminar atributos asociadas
    await supabase
      .from('property_amenities')
      .delete()
      .eq('property_id', propertyId)

    // 3. Eliminar propiedad
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)

    if (error) throw error

    notify('Propiedad eliminada exitosamente')
    router.push('/admin/properties')

  } catch (error) {
    console.error('Error eliminando propiedad:', error)
    notify('Error al eliminar la propiedad: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.edit-property-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: var(--color-text);
  font-size: 2rem;
}

.subtitle {
  color: var(--color-text-light);
  margin: 0.5rem 0 0 0;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: var(--color-primary);
  color: white;
}

.property-form {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  color: var(--color-primary);
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 120px;
}

.form-group select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-group label:has(input[type="checkbox"]) {
  flex-direction: row;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
}

/* Atributos */
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
}

.amenity-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.amenity-checkbox:hover {
  border-color: var(--color-secondary);
  background: #f8fbfd;
}

.amenity-checkbox:has(input:checked) {
  border-color: var(--color-primary);
  background: #eef7fb;
}

.amenity-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.amenity-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--color-text);
}

.amenity-icon {
  font-size: 1.1rem;
  color: var(--color-primary);
}

.loading-text,
.empty-text {
  color: var(--color-text-light);
  font-size: 0.95rem;
  padding: 1rem 0;
}

/* Galería de imágenes */
.existing-images {
  margin-bottom: 2rem;
}

.gallery-subtitle {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.new-images {
  margin-top: 2rem;
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  text-align: center;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;
}

.btn-upload:hover {
  background: var(--color-primary);
  transform: translateY(-2px);
}

.selected-files {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-main {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(34, 197, 94, 0.95);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-remove {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: rgb(220, 38, 38);
  transform: scale(1.1);
}

/* Botones de acción */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-cancel,
.btn-submit,
.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e5e7eb;
  color: var(--color-text);
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-delete {
  background: #fecaca;
  color: #7f1d1d;
}

.btn-delete:hover:not(:disabled) {
  background: #fca5a5;
}

.btn-submit {
  background: var(--color-primary);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #0d7599;
  transform: translateY(-2px);
}

.btn-cancel:disabled,
.btn-submit:disabled,
.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.spinning-large {
  font-size: 3rem;
  animation: spin 1s linear infinite;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  color: var(--color-text-light);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Image action buttons */
.image-actions {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.btn-main {
  background: rgba(251, 146, 60, 0.9);
  color: white;
}

.btn-main:hover:not(:disabled) {
  background: rgb(251, 146, 60);
  transform: scale(1.1);
}

.btn-main.active {
  background: rgba(34, 197, 94, 0.9);
  cursor: default;
}

.btn-main:disabled {
  cursor: default;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-property-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .property-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit,
  .btn-delete {
    width: 100%;
    justify-content: center;
  }
}
</style>
