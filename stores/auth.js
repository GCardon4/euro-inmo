import { defineStore } from 'pinia'

// Store para gestión de autenticación
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    // Verificar si el usuario está autenticado
    isAuthenticated: (state) => !!state.user,
    
    // Verificar si el usuario es admin
    isAdmin: (state) => state.profile?.role_id === 1,
    
    // Verificar si el usuario es asesor
    isAsesor: (state) => state.profile?.role_id === 2,
    
    // Obtener nombre completo del usuario
    fullName: (state) => {
      if (!state.profile) return ''
      return `${state.profile.first_name} ${state.profile.last_name}`
    }
  },

  actions: {
    // Inicializar sesión desde Supabase
    async initAuth() {
      const config = useRuntimeConfig()
      
      // Verificar que las variables de entorno estén configuradas
      if (!config.public.supabaseUrl || !config.public.supabaseKey) {
        console.warn('Supabase no configurado correctamente')
        return
      }
      
      const supabase = useSupabaseClient()
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          this.user = user
          await this.fetchProfile()
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error)
      }
    },

    // Obtener perfil del usuario desde la tabla profiles
    async fetchProfile() {
      if (!this.user) return

      const supabase = useSupabaseClient()
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*, roles:role_id(*)')
          .eq('id', this.user.id)
          .single()

        if (error) throw error
        
        this.profile = data
      } catch (error) {
        console.error('Error al cargar perfil:', error)
        this.error = error.message
      }
    },

    // Iniciar sesión con email y contraseña
    async signIn(email, password) {
      this.loading = true
      this.error = null

      const supabase = useSupabaseClient()

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        this.user = data.user
        await this.fetchProfile()

        return { success: true }
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    // Cerrar sesión
    async signOut() {
      const supabase = useSupabaseClient()

      try {
        const { error } = await supabase.auth.signOut()
        
        if (error) throw error

        this.user = null
        this.profile = null
        
        // Redirigir a home
        navigateTo('/')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        this.error = error.message
      }
    },

    // Registrar nuevo usuario (solo para admin)
    async signUp(userData) {
      this.loading = true
      this.error = null

      const supabase = useSupabaseClient()

      try {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.firstName,
              last_name: userData.lastName,
              role_id: userData.roleId || 2
            }
          }
        })

        if (error) throw error

        return { success: true, user: data.user }
      } catch (error) {
        console.error('Error al registrar usuario:', error)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    }
  }
})
