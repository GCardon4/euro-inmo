<template>
  <section class="contact-section">
    <div class="container">
      <div class="contact-grid">
        <!-- Columna izquierda: Información -->
        <div class="contact-info">
          <h2 class="contact-title">¿Listo para encontrar tu propiedad ideal?</h2>
          <p class="contact-description">
            Estamos aquí para ayudarte. Completa el formulario y uno de nuestros 
            asesores se pondrá en contacto contigo en menos de 24 horas.
          </p>

          <!-- Información de contacto -->
          <div class="contact-details">
            <a href="https://www.google.com/maps/place/Euro+Inmobiliaria/@6.1725905,-75.3330971,17.75z/data=!4m6!3m5!1s0x8e46a100b9912197:0xf93f9e5cb4ac9fb!8m2!3d6.1724591!4d-75.3345397!16s%2Fg%2F11j8rn2pfm" target="_blank" rel="noopener noreferrer" class="detail-item detail-link">
              <div class="detail-icon">
                <Icon name="location_on" />
              </div>
              <div class="detail-content">
                <h4>Ubicación</h4>
                <p>Calle 29 N° 29-15<br>Marinilla, Antioquia</p>
              </div>
            </a>

            <div class="detail-item">
              <div class="detail-icon">
                <Icon name="phone" />
              </div>
              <div class="detail-content">
                <h4>Teléfonos</h4>
                <p>+57 301 242 1919<br>+57 350 777 6633</p>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">
                <Icon name="email" />
              </div>
              <div class="detail-content">
                <h4>Email</h4>
                <p>euroinmobiliaria2012@gmail.com</p>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">
                <Icon name="schedule" />
              </div>
              <div class="detail-content">
                <h4>Horario</h4>
                <p>Lunes - Viernes: 8:00 AM - 6:00 PM<br>Sábados: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>

          <!-- Redes sociales -->
          <div class="social-section">
            <h4>Síguenos</h4>
            <div class="social-links">
              <a target="_blank" href="https://www.facebook.com/euroinmobiliaria.sas" class="social-link" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a target="_blank" href="https://www.instagram.com/euro_inmobiliaria" class="social-link" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a target="_blank" href="https://wa.me/573012421919" class="social-link" aria-label="WhatsApp">
                <Icon name="chat" />
              </a>

            </div>
          </div>
        </div>

        <!-- Columna derecha: Formulario -->
        <div class="contact-form-container">
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nombre Completo*</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  id="name" 
                  required
                  placeholder="Tu nombre"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email*</label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  id="email" 
                  required
                  placeholder="tu@email.com"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label for="phone">Teléfono*</label>
                <input 
                  v-model="formData.phone" 
                  type="tel" 
                  id="phone" 
                  required
                  placeholder="300 123 4567"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="interest">Estoy Interesado En</label>
                <select v-model="formData.interest" id="interest" class="form-select">
                  <option value="">Selecciona una opción</option>
                  <option value="comprar">Comprar</option>
                  <option value="arrendar">Arrendar</option>
                  <option value="vender">Vender mi propiedad</option>
                  <option value="asesoría">Asesoría general</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="message">Mensaje*</label>
                <textarea 
                  v-model="formData.message" 
                  id="message" 
                  rows="5"
                  required
                  placeholder="Cuéntanos más sobre lo que necesitas..."
                  class="form-textarea"
                ></textarea>
              </div>
            </div>

            <!-- Checkbox de privacidad -->
            <div class="form-checkbox">
              <input 
                v-model="formData.acceptPrivacy" 
                type="checkbox" 
                id="privacy" 
                required
              >
              <label for="privacy">
                Acepto la política de privacidad y el tratamiento de mis datos personales
              </label>
            </div>

            <!-- Botón de envío -->
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <span v-if="!isSubmitting">Enviar Mensaje</span>
              <span v-else>Enviando...</span>
            </button>

            <!-- Mensaje de éxito -->
            <div v-if="showSuccess" class="success-message">
              ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
            </div>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const config = useRuntimeConfig()

// Datos del formulario
const formData = ref({
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
  acceptPrivacy: false
})

// Estados del formulario
const isSubmitting = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')

// Obtener token de reCAPTCHA v3
const getRecaptchaToken = () => {
  if (!process.client) return Promise.reject(new Error('Solo cliente'))
  return new Promise((resolve, reject) => {
    const siteKey = config.public.recaptchaSiteKey
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA no cargado'))
      return
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action: 'contact_form' })
        .then(resolve)
        .catch(reject)
    })
  })
}

// Manejar envío del formulario
const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  showSuccess.value = false

  try {
    // Obtener token reCAPTCHA
    const recaptchaToken = await getRecaptchaToken()

    // Enviar al API
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        interest: formData.value.interest,
        message: formData.value.message,
        recaptchaToken
      }
    })

    // Mostrar mensaje de éxito
    showSuccess.value = true

    // Resetear formulario
    formData.value = {
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: '',
      acceptPrivacy: false
    }

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Error al enviar formulario:', error)
    errorMessage.value = error?.data?.statusMessage
      || 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-section {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 4rem;
  align-items: start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-label {
  color: #0b6182;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e1e1c;
  line-height: 1.2;
  margin: 0;
}

.contact-description {
  font-size: 1.125rem;
  color: #585857;
  line-height: 1.8;
  margin: 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.detail-item {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.detail-link {
  text-decoration: none;
  color: inherit;
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin: -0.75rem;
  transition: background 0.3s ease;
}

.detail-link:hover {
  background: rgba(11, 97, 130, 0.06);
}

.detail-link:hover .detail-icon {
  background: linear-gradient(135deg, #0b6182 0%, #094d68 100%);
  color: white;
}

.detail-link:hover .detail-content h4 {
  color: #0b6182;
}

.detail-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #0b6182;
}

.detail-icon .material-icons {
  font-size: 28px;
}

.detail-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e1e1c;
}

.detail-content p {
  margin: 0;
  color: #585857;
  line-height: 1.6;
}

.social-section {
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.social-section h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e1e1c;
  margin: 0 0 1rem 0;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0b6182 0%, #082f3d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(11, 97, 130, 0.3);
  color: white;
}

.social-link .material-icons {
  font-size: 24px;
}

.social-link .social-svg-icon {
  width: 24px;
  height: 24px;
}

.social-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.contact-form-container {
  background: white;
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.form-row:has(.form-group:nth-child(2)) {
  grid-template-columns: 1fr 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  background: white;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.form-checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-checkbox label {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  cursor: pointer;
}

.btn-submit {
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  padding: 1rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  animation: slideInUp 0.3s ease-out;
}

.error-message {
  padding: 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .contact-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 3rem 1rem;
  }

  .contact-title {
    font-size: 1.75rem;
  }

  .contact-description {
    font-size: 1rem;
  }

  .contact-form-container {
    padding: 2rem 1.5rem;
  }

  .form-row:has(.form-group:nth-child(2)) {
    grid-template-columns: 1fr;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
