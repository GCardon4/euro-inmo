import { defineStore } from 'pinia'

// Store para gestión de propiedades
export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    properties: [],
    featuredProperties: [],
    filters: {
      status: '',
      categoryId: '',
      cityId: '',
      minPrice: null,
      maxPrice: null
    },
    loading: false,
    error: null
  }),

  getters: {
    // Obtener propiedades filtradas
    filteredProperties: (state) => {
      let filtered = [...state.properties]

      // Filtrar por estado (venta/arriendo)
      if (state.filters.status) {
        filtered = filtered.filter(p => 
          p.status.toLowerCase() === state.filters.status.toLowerCase()
        )
      }

      // Filtrar por categoría
      if (state.filters.categoryId) {
        filtered = filtered.filter(p => 
          p.categoryId === state.filters.categoryId
        )
      }

      // Filtrar por ciudad
      if (state.filters.cityId) {
        filtered = filtered.filter(p => 
          p.cityId === state.filters.cityId
        )
      }

      // Filtrar por rango de precio
      if (state.filters.minPrice) {
        filtered = filtered.filter(p => 
          p.price >= state.filters.minPrice
        )
      }

      if (state.filters.maxPrice) {
        filtered = filtered.filter(p => 
          p.price <= state.filters.maxPrice
        )
      }

      return filtered
    },

    // Obtener propiedades por categoría
    getPropertiesByCategory: (state) => (category) => {
      return state.properties.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      )
    },

    // Obtener propiedad por código
    getPropertyByCode: (state) => (code) => {
      return state.properties.find(p => p.code === code)
    }
  },

  actions: {
    // Cargar todas las propiedades desde Supabase
    async fetchProperties() {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            categorias:category_id(*),
            city:city_id(*),
            state:state_id(*)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.properties = data || []
        
        // Extraer propiedades destacadas (las 6 primeras)
        this.featuredProperties = this.properties.slice(0, 6)
        
      } catch (error) {
        console.error('Error al cargar propiedades:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Cargar una propiedad específica por código
    async fetchPropertyByCode(code) {
      this.loading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            categorias:category_id(*),
            city:city_id(*),
            state:state_id(*),
            zone:zone_id(*)
          `)
          .eq('code', code)
          .eq('is_active', true)
          .single()

        if (error) throw error

        return data
        
      } catch (error) {
        console.error('Error al cargar propiedad:', error)
        this.error = error.message
        return null
      } finally {
        this.loading = false
      }
    },

    // Actualizar filtros de búsqueda
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    // Limpiar filtros
    clearFilters() {
      this.filters = {
        status: '',
        categoryId: '',
        cityId: '',
        minPrice: null,
        maxPrice: null
      }
    },

    // Incrementar contador de vistas
    async incrementViews(propertyId) {
      try {
        const supabase = useSupabaseClient()
        
        // Registrar vista en la tabla properties_view
        const { error } = await supabase
          .from('properties_view')
          .insert({
            property_id: propertyId,
            viewed_at: new Date().toISOString()
          })

        if (error) throw error
        
      } catch (error) {
        console.error('Error al registrar vista:', error)
      }
    }
  }
})
