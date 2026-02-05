// Composable para debuggear propiedades y categorías
export const usePropertiesDebug = () => {
  const supabase = useSupabaseClient()

  // Verificar propiedades y categorías
  const checkPropertiesData = async () => {
    try {
      // Obtener todas las propiedades con sus categorías
      const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select(`
          id,
          code,
          name,
          category!inner(name)
        `)
        .limit(20)

      if (propsError) {
        console.error('❌ Error al obtener propiedades:', propsError)
        return null
      }

      // Obtener todas las categorías disponibles
      const { data: categories, error: catError } = await supabase
        .from('category')
        .select('id, name')

      if (catError) {
        console.error('❌ Error al obtener categorías:', catError)
        return null
      }

      console.log('========== PROPIEDADES DEBUG ==========')
      console.log('Total propiedades:', properties?.length || 0)
      console.log('Categorías disponibles:', categories?.map(c => c.name) || [])
      console.log('\nPropiedades por categoría:')
      properties?.forEach(p => {
        console.log(`  - ${p.code}: ${p.name} -> ${p.category?.name || 'SIN CATEGORÍA'}`)
      })

      return {
        properties,
        categories,
        summary: {
          totalProperties: properties?.length || 0,
          availableCategories: categories?.map(c => c.name) || [],
          propertiesByCategory: categorizeProperties(properties || [])
        }
      }
    } catch (err) {
      console.error('❌ Error en checkPropertiesData:', err)
      return null
    }
  }

  // Agrupar propiedades por categoría
  const categorizeProperties = (properties) => {
    const grouped = {}
    properties.forEach(prop => {
      const category = prop.category?.name?.toLowerCase() || 'sin-categoria'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(prop.code)
    })
    return grouped
  }

  return {
    checkPropertiesData
  }
}
