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

        <!-- Imagen -->
        <div class="form-group">
          <label for="images">Imagen Principal *</label>
          <div class="image-upload-area">
            <input
              id="images"
              ref="fileInput"
              type="file"
              accept="image/*"
              class="file-input"
              @change="handleFileSelect"
            >
            <div class="upload-zone" @click="$refs.fileInput.click()">
              <div v-if="!preview" class="upload-content">
                <Icon name="cloud_upload" custom-class="upload-icon" />
                <p>Haz clic o arrastra una imagen aquí</p>
                <span class="upload-hint">PNG, JPG, GIF (máx. 5MB)</span>
              </div>
              <div v-else class="preview-content">
                <img :src="preview" :alt="formData.name" class="preview-image">
                <button type="button" @click.stop="removeImage" class="btn-remove-image">
                  ✕ Remover imagen
                </button>
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

// Estado reactivo
const formData = ref({
  name: '',
  description: '',
  is_active: true
})

const selectedFile = ref(null)
const preview = ref(null)
const submitting = ref(false)
const fileInput = ref(null)

// Manejar selección de archivo
const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validar tamaño
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo es demasiado grande (máx. 5MB)')
    return
  }

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result
  }
  reader.readAsDataURL(file)

  selectedFile.value = file
}

// Remover imagen
const removeImage = () => {
  selectedFile.value = null
  preview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Enviar formulario
const submitForm = async () => {
  // Validaciones
  if (!formData.value.name.trim()) {
    alert('El nombre del proyecto es requerido')
    return
  }

  if (!formData.value.description.trim()) {
    alert('La descripción del proyecto es requerida')
    return
  }

  if (!selectedFile.value) {
    alert('Debes agregar una imagen al proyecto')
    return
  }

  if (formData.value.description.length > 1000) {
    alert('La descripción no puede exceder 1000 caracteres')
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
          is_active: formData.value.is_active
        }
      ])
      .select()

    if (projectError) {
      console.error('❌ Error al crear proyecto:', projectError)
      alert('Error al crear el proyecto')
      return
    }

    const projectId = projectData[0].id
    console.log('✅ Proyecto creado:', projectId)

    // 2. Subir imagen
    const fileExtension = selectedFile.value.name.split('.').pop()
    const fileName = `${projectId}.${fileExtension}`
    const filePath = `projects/public/${projectId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, selectedFile.value, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Error al subir imagen:', uploadError)
      alert('Error al subir la imagen')
      return
    }

    console.log('✅ Imagen subida:', filePath)

    // 3. Obtener URL pública de la imagen
    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    // 4. Crear registro en projects_images
    const { error: imageError } = await supabase
      .from('projects_images')
      .insert([
        {
          project_id: projectId,
          url_image: publicUrl,
          main: true
        }
      ])

    if (imageError) {
      console.error('❌ Error al crear registro de imagen:', imageError)
      alert('Error al guardar la referencia de la imagen')
      return
    }

    console.log('✅ Proyecto creado exitosamente')
    alert('Proyecto creado exitosamente')
    router.push('/admin/projects')
  } catch (err) {
    console.error('❌ Error en submitForm:', err)
    alert('Error al crear el proyecto')
  } finally {
    submitting.value = false
  }
}

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
