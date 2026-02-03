<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo y título -->
      <div class="login-header">
        <h1 class="logo">Euro Inmo</h1>
        <h2>Iniciar Sesión</h2>
        <p>Accede al panel administrativo</p>
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="formData.email"
            type="email"
            id="email"
            required
            placeholder="tu@email.com"
            class="form-input"
            :disabled="loading"
          >
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            v-model="formData.password"
            type="password"
            id="password"
            required
            placeholder="••••••••"
            class="form-input"
            :disabled="loading"
          >
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Botón de login -->
        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else>Iniciando sesión...</span>
        </button>

        <!-- Link a home -->
        <NuxtLink to="/" class="back-home">
          ← Volver al inicio
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Meta tags para SEO
useHead({
  title: 'Login - Euro Inmo',
  meta: [
    { name: 'description', content: 'Accede al panel administrativo de Euro Inmo' }
  ]
})

// Store de autenticación
const authStore = useAuthStore()

// Obtener cliente Supabase y config en el contexto del componente
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

// Datos del formulario
const formData = ref({
  email: '',
  password: ''
})

// Estados
const loading = ref(false)
const errorMessage = ref('')

// Manejar inicio de sesión
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.signIn(
      formData.value.email,
      formData.value.password,
      supabase
    )

    if (result.success) {
      // Redirigir al dashboard
      await navigateTo('/admin/dashboard')
    } else {
      errorMessage.value = result.error || 'Error al iniciar sesión'
    }
  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = 'Error al iniciar sesión. Por favor intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

// Verificar si ya está autenticado
onMounted(async () => {
  await authStore.initAuth(supabase, config)

  if (authStore.isAuthenticated) {
    navigateTo('/admin/dashboard')
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  background: white;
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2563eb;
  margin: 0 0 1rem 0;
}

.login-header h2 {
  font-size: 1.75rem;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #374151;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.form-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.875rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.btn-login {
  padding: 1rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-home {
  text-align: center;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.back-home:hover {
  color: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }

  .login-container {
    padding: 2rem 1.5rem;
  }

  .logo {
    font-size: 2rem;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>
