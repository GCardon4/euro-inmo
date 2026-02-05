<template>
  <div class="create-property-page">
    <div class="page-header">
      <div>
        <h1>Crear Nueva Propiedad</h1>
        <p class="subtitle">Completa la información de la propiedad</p>
      </div>
      <NuxtLink to="/admin/properties" class="btn-back">
        <Icon name="arrow_back" />
        Volver
      </NuxtLink>
    </div>

    <form @submit.prevent="handleSubmit" class="property-form">
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
          <div class="description-input-wrapper">
            <textarea 
              v-model="formData.description" 
              id="description" 
              rows="5"
              required
              placeholder="Describe las características principales de la propiedad..."
            ></textarea>
            <ClientOnly>
              <AudioTextInput v-model="formData.description" showPreview />
            </ClientOnly>
          </div>
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
              v-model="formData.price"
              type="number"
              id="price"
              placeholder="1500000"
              min="0"
              step="any"
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
      </div>

      <!-- Comodidades -->
      <div class="form-section">
        <h2 class="section-title">Comodidades</h2>

        <div v-if="amenitiesLoading" class="loading-text">Cargando comodidades...</div>
        <div v-else-if="amenities.length === 0" class="empty-text">No hay comodidades registradas</div>
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

        <div v-if="uploadedImages.length > 0" class="image-gallery">
          <div v-for="(image, index) in uploadedImages" :key="index" class="image-item">
            <img :src="image.url" :alt="`Imagen ${index + 1}`">
            <div v-if="image.isMain" class="badge-main">Principal</div>
            <button type="button" @click="removeImage(index)" class="btn-remove">
              <Icon name="delete" />
            </button>
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
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          <Icon v-if="!isSubmitting" name="save" />
          <Icon v-else name="refresh" custom-class="spinning" />
          {{ isSubmitting ? 'Guardando...' : 'Guardar Propiedad' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const supabase = useSupabaseClient()
const router = useRouter()
const { notify } = useNotification()

// Estados
const isSubmitting = ref(false)
const categories = ref([])
const statuses = ref([])
const states = ref([])
const cities = ref([])
const zones = ref([])
const selectedFiles = ref([])
const uploadedImages = ref([])
const fileInput = ref(null)
const amenities = ref([])
const amenitiesLoading = ref(false)
const selectedAmenities = ref([])

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
  is_active: true
})

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadStatuses(),
    loadStates(),
    loadAmenities()
  ])
})

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
  formData.value.city_id = ''
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

// Cargar comodidades disponibles
const loadAmenities = async () => {
  amenitiesLoading.value = true

  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error cargando comodidades:', error)
    amenitiesLoading.value = false
    return
  }

  amenities.value = data || []
  amenitiesLoading.value = false
}

// Agregar marca de agua a la imagen
const addWatermark = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          
          // Dibujar imagen original
          ctx.drawImage(img, 0, 0)
          
          // Cargar marca de agua
          const watermarkImg = new Image()
          watermarkImg.crossOrigin = 'anonymous'
          watermarkImg.src = '/logotipo-euroinmo.png'
          
          watermarkImg.onload = () => {
            // Calcular tamaño de la marca de agua (30% de la imagen)
            const watermarkSize = Math.min(img.width, img.height) * 0.3
            const watermarkWidth = watermarkImg.width * (watermarkSize / watermarkImg.height)
            const watermarkHeight = watermarkSize
            
            // Posicionar en el centro
            const x = (img.width - watermarkWidth) / 2
            const y = (img.height - watermarkHeight) / 2
            
            // Aplicar opacidad (35%)
            ctx.globalAlpha = 0.35
            ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)
            ctx.globalAlpha = 1.0
            
            // Convertir canvas a blob - usar siempre image/jpeg para consistencia
            const outputType = 'image/jpeg'
            const quality = 0.92
            canvas.toBlob((blob) => {
              if (!blob) {
                console.error('Error: canvas.toBlob retornó null')
                resolve(file) // Retorna archivo original si falla
                return
              }
              // Crear archivo con la marca de agua - asegurar extensión .jpg
              const baseName = file.name.replace(/\.(jpeg|jpg|png|webp)$/i, '')
              const watermarkedFile = new File(
                [blob],
                `${baseName}.jpg`,
                { type: outputType }
              )
              resolve(watermarkedFile)
            }, outputType, quality)
          }
          
          watermarkImg.onerror = () => {
            // Si falla cargar la marca de agua, retorna el archivo original
            resolve(file)
          }
        }
        img.src = e.target.result
      } catch (error) {
        console.error('Error agregando marca de agua:', error)
        resolve(file) // Retorna archivo original en caso de error
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// Manejar selección de archivos
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files
  
  // Generar vista previa
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImages.value.push({
        file,
        url: e.target.result,
        isMain: uploadedImages.value.length === 0
      })
    }
    reader.readAsDataURL(file)
  })
}

// Subir imágenes a Supabase Storage con estructura de carpetas por código
const uploadImages = async (propertyCode) => {
  if (uploadedImages.value.length === 0) return []

  const uploadedUrls = []

  for (let i = 0; i < uploadedImages.value.length; i++) {
    const imageData = uploadedImages.value[i]
    let file = imageData.file

    // Agregar marca de agua a la imagen (convierte a .jpg)
    file = await addWatermark(file)

    // Generar nombre después de watermark (ya que convierte a .jpg)
    const fileName = `${Date.now()}_${i}.jpg`
    // Ruta: public/{code}/{filename} — requerido por políticas RLS de storage
    const filePath = `public/${propertyCode}/${fileName}`

    const { data, error } = await supabase.storage
      .from('properties')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
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

// Remover imagen y ajustar imagen principal
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
  // Si hay imágenes, la primera es principal
  if (uploadedImages.value.length > 0) {
    uploadedImages.value.forEach((img, idx) => {
      img.isMain = idx === 0
    })
  }
}

// Enviar formulario
const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // 1. Preparar datos de la propiedad
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
      is_active: formData.value.is_active
    }

    // 2. Insertar propiedad
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single()

    if (error) throw error

    // 3. Subir imágenes a storage y guardar registros en properties_images
    const imageUrls = await uploadImages(formData.value.code)
    
    if (imageUrls.length > 0) {
      const imageRecords = imageUrls.map(imageData => ({
        property_id: data.id,
        url_image: imageData.url,
        main: imageData.isMain,
        code: formData.value.code
      }))

      const { error: imageError } = await supabase
        .from('properties_images')
        .insert(imageRecords)

      if (imageError) {
        console.error('Error guardando imágenes:', imageError)
      }
    }

    // 4. Guardar comodidades seleccionadas
    if (selectedAmenities.value.length > 0) {
      const amenityRows = selectedAmenities.value.map(amenityId => ({
        property_id: data.id,
        amenity_id: amenityId
      }))

      const { error: amenityError } = await supabase
        .from('property_amenities')
        .insert(amenityRows)

      if (amenityError) {
        console.error('Error guardando comodidades:', amenityError)
      }
    }

    notify('Propiedad creada exitosamente')
    router.push('/admin/properties')

  } catch (error) {
    console.error('Error creando propiedad:', error)
    notify('Error al crear la propiedad: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.create-property-page {
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

.description-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description-input-wrapper textarea {
  resize: vertical;
  min-height: 120px;
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

/* Comodidades */
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
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
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
.btn-submit {
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

.btn-submit {
  background: var(--color-primary);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #0d7599;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .create-property-page {
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
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
