<template>
  <section class="contact-section">
    <div class="container">
      <div class="contact-grid">
        <!-- Columna izquierda: Información -->
        <div class="contact-info">
          <span class="contact-label">Contáctanos</span>
          <h2 class="contact-title">¿Listo para Encontrar Tu Propiedad Ideal?</h2>
          <p class="contact-description">
            Estamos aquí para ayudarte. Completa el formulario y uno de nuestros 
            asesores se pondrá en contacto contigo en menos de 24 horas.
          </p>

          <!-- Información de contacto -->
          <div class="contact-details">
            <div class="detail-item">
              <div class="detail-icon">📍</div>
              <div class="detail-content">
                <h4>Ubicación</h4>
                <p>Calle Principal #123<br>Rionegro, Antioquia</p>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">📞</div>
              <div class="detail-content">
                <h4>Teléfono</h4>
                <p>+57 (604) 123 4567<br>+57 300 123 4567</p>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">✉️</div>
              <div class="detail-content">
                <h4>Email</h4>
                <p>info@euroinmo.com<br>ventas@euroinmo.com</p>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">🕐</div>
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
              <a href="#" class="social-link" aria-label="Facebook">
                <span>📘</span>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <span>📷</span>
              </a>
              <a href="#" class="social-link" aria-label="WhatsApp">
                <span>💬</span>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <span>💼</span>
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
              ✓ ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
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

// Manejar envío del formulario
const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // TODO: Implementar envío a API/Supabase
    console.log('Datos del formulario:', formData.value)
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500))
    
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
    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.')
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
  color: #2563eb;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  margin: 0;
}

.contact-description {
  font-size: 1.125rem;
  color: #4b5563;
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

.detail-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.detail-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.detail-content p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.social-section {
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.social-section h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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
