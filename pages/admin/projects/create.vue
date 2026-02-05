<template>
  <div class="create-project-page">
    <!-- Header -->
    <div class="page-header">
      <NuxtLink to="/admin/projects" class="btn-back">
        ← Volver
      </NuxtLink>
      <h1>Crear Nuevo Proyecto</h1>
    </div>

    <!-- Formulario -->
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Nombre del Proyecto *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Ej: Residencial Montaña Verde"
            class="form-input"
            required
          >
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="description">Descripción *</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Describe detalladamente el proyecto..."
            class="form-textarea"
            rows="6"
            required
          ></textarea>
          <div class="char-count">
            {{ formData.description.length }}/1000 caracteres
          </div>
        </div>

        <!-- Slogan -->
        <div class="form-group">
          <label for="slogan">Slogan del Proyecto</label>
          <input
            id="slogan"
            v-model="formData.slogan"
            type="text"
            placeholder="Ej: Tu hogar, tu estilo de vida"
            class="form-input"
          >
        </div>

        <!-- Información (Bullets) -->
        <div class="form-group">
          <label for="information">Información del Proyecto (separada por comas o |)</label>
          <textarea
            id="information"
            v-model="formData.information"
            placeholder="Ej: Piscina, Gym, Zonas verdes, Seguridad 24/7"
            class="form-textarea"
            rows="4"
          ></textarea>
          <small class="form-hint">Escribe cada característica separada por coma (,) o barra (|)</small>
        </div>

        <!-- Contacto -->
        <div class="form-group">
          <label for="contact">Teléfono de Contacto</label>
          <input
            id="contact"
            v-model="formData.contact"
            type="tel"
            placeholder="Ej: +57 300 1234567"
            class="form-input"
          >
        </div>

        <!-- Activo -->
        <div class="form-group">
          <label for="is_active">
            <input
              id="is_active"
              v-model="formData.is_active"
              type="checkbox"
              class="form-checkbox"
            >
            <span>Proyecto Activo</span>
          </label>
        </div>

        <!-- Imágenes (Galería) -->
        <div class="form-group">
          <label for="images">Imágenes del Proyecto *</label>
          <div class="image-upload-area">
            <input
              id="images"
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              class="file-input"
              @change="handleFileSelect"
            >
            <div class="upload-zone" @click="$refs.fileInput.click()">
              <Icon name="cloud_upload" custom-class="upload-icon" />
              <p>Haz clic o arrastra imágenes aquí</p>
              <span class="upload-hint">PNG, JPG, GIF (máx. 5MB c/u)</span>
            </div>
          </div>

          <!-- Preview de nuevas imágenes -->
          <div v-if="newImages.length > 0" class="images-preview">
            <h4 class="preview-title">Imágenes a subir ({{ newImages.length }})</h4>
            <div class="image-grid">
              <div v-for="(image, index) in newImages" :key="index" class="image-item">
                <img :src="image.url" :alt="formData.name" class="image-thumbnail">
                <div class="image-actions">
                  <button 
                    v-if="index === 0"
                    type="button" 
                    disabled 
                    class="btn-action btn-main active"
                    title="Imagen principal"
                  >
                    <Icon name="star" />
                  </button>
                  <button 
                    v-else
                    type="button" 
                    @click="setMainImage(index)"
                    class="btn-action btn-main"
                    title="Establecer como principal"
                  >
                    <Icon name="star_outline" />
                  </button>
                  <button 
                    type="button" 
                    @click="removeNewImage(index)"
                    class="btn-action btn-delete"
                    title="Eliminar"
                  >
                    <Icon name="delete" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <NuxtLink to="/admin/projects" class="btn-cancel">
            Cancelar
          </NuxtLink>
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? 'Creando...' : 'Crear Proyecto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Composables
const supabase = useSupabaseClient()
const router = useRouter()
const { notify } = useNotification()

// Estado reactivo
const formData = ref({
  name: '',
  description: '',
  slogan: '',
  information: '',
  contact: '',
  is_active: true
})

const newImages = ref([])
const submitting = ref(false)
const fileInput = ref(null)

// Manejar selección de archivos (múltiples)
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  
  files.forEach((file) => {
    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      notify(`${file.name} es demasiado grande (máx. 5MB)`, 'error')
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      newImages.value.push({
        file,
        url: e.target?.result,
        isMain: false
      })
    }
    reader.readAsDataURL(file)
  })
}

// Establecer imagen como principal
const setMainImage = (index) => {
  // Resetear todas
  newImages.value.forEach(img => {
    img.isMain = false
  })
  // Establecer la seleccionada
  newImages.value[index].isMain = true
  // Mover a la primera posición
  const [image] = newImages.value.splice(index, 1)
  newImages.value.unshift(image)
}

// Remover imagen
const removeNewImage = (index) => {
  newImages.value.splice(index, 1)
}

// Subir imágenes a Storage
const uploadImages = async (projectCode) => {
  if (newImages.value.length === 0) return []

  const uploadedUrls = []

  for (let i = 0; i < newImages.value.length; i++) {
    const imageData = newImages.value[i]
    const file = imageData.file
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${i}.${fileExt}`
    const filePath = `public/${projectCode}/${fileName}`

    const { data, error } = await supabase.storage
      .from('projects')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Error subiendo imagen:', error)
      notify(`Error al subir ${file.name}`, 'error')
      continue
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    uploadedUrls.push({
      url: urlData.publicUrl,
      isMain: imageData.isMain
    })
  }

  return uploadedUrls
}

// Enviar formulario
const submitForm = async () => {
  // Validaciones
  if (!formData.value.name.trim()) {
    notify('El nombre del proyecto es requerido', 'error')
    return
  }

  if (!formData.value.description.trim()) {
    notify('La descripción del proyecto es requerida', 'error')
    return
  }

  if (newImages.value.length === 0) {
    notify('Debes agregar al menos una imagen', 'error')
    return
  }

  if (formData.value.description.length > 1000) {
    notify('La descripción no puede exceder 1000 caracteres', 'error')
    return
  }

  submitting.value = true

  try {
    // 1. Crear el proyecto
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          name: formData.value.name.trim(),
          description: formData.value.description.trim(),
          slogan: formData.value.slogan.trim(),
          information: formData.value.information.trim(),
          contact: formData.value.contact.trim(),
          is_active: formData.value.is_active
        }
      ])
      .select()

    if (projectError) {
      console.error('❌ Error al crear proyecto:', projectError)
      notify('Error al crear el proyecto', 'error')
      return
    }

    const projectId = projectData[0].id
    const projectCode = projectData[0].id // Usar el ID del proyecto

    console.log('✅ Proyecto creado:', projectId)

    // 2. Subir imágenes
    const uploadedUrls = await uploadImages(projectCode)

    if (uploadedUrls.length === 0) {
      console.error('❌ No se subieron imágenes')
      notify('Error al subir las imágenes', 'error')
      return
    }

    // 3. Guardar registros en projects_images
    const imageRecords = uploadedUrls.map((imageData, index) => ({
      project_id: projectId,
      url_image: imageData.url,
      main: index === 0 // La primera es la principal
    }))

    const { error: imageError } = await supabase
      .from('projects_images')
      .insert(imageRecords)

    if (imageError) {
      console.error('❌ Error al guardar imágenes:', imageError)
      notify('Error al guardar las imágenes', 'error')
      return
    }

    notify('Proyecto creado exitosamente', 'success')
    console.log('✅ Proyecto creado exitosamente')
    router.push('/admin/projects')

  } catch (err) {
    console.error('❌ Error en submitForm:', err)
    notify('Error al crear el proyecto', 'error')
  } finally {
    submitting.value = false
  }
}

// Configurar layout
definePageMeta({
  layout: 'admin'
})

// SEO
useSeoMeta({
  title: 'Crear Proyecto - Admin',
  robots: 'noindex'
})
</script>

<style scoped>
.create-project-page {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0b6182;
  border: 2px solid #0b6182;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #0b6182;
  color: white;
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #1e1e1c;
  flex: 1;
}

.form-container {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1e1e1c;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0b6182;
  box-shadow: 0 0 0 3px rgba(11, 97, 130, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

.char-count {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  text-align: right;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.form-checkbox {
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-group label span {
  cursor: pointer;
  user-select: none;
}

.image-upload-area {
  margin-top: 1rem;
}

.file-input {
  display: none;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.upload-zone:hover {
  border-color: #0b6182;
  background: rgba(11, 97, 130, 0.05);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2.5rem;
  color: #0b6182;
}

.upload-content p {
  margin: 0;
  font-weight: 600;
  color: #1e1e1c;
}

.upload-hint {
  font-size: 0.85rem;
  color: #6b7280;
}

.preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 0.5rem;
  object-fit: cover;
}

.btn-remove-image {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-remove-image:hover {
  background: #991b1b;
  color: white;
}

/* Galería de imágenes */
.images-preview {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e1e1c;
  margin: 0 0 1rem 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.image-item {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.image-thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.image-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.image-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.btn-action {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  height: 36px;
  width: 100%;
}

.btn-action:hover:not(:disabled) {
  background: white;
  transform: scale(1.05);
}

.btn-action:disabled {
  opacity: 0.9;
  cursor: default;
}

.btn-main {
  color: #f59e0b;
}

.btn-main.active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.2);
}

.btn-delete {
  color: #ef4444;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: #0b6182;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-left: auto;
}

.btn-submit:hover:not(:disabled) {
  background: #082f3d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 97, 130, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .create-project-page {
    padding: 1rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-submit {
    margin-left: 0;
  }
}
</style>
