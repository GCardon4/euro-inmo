// Composable para manejar filtros de propiedades desde URL
export const usePropertyFilters = () => {
  const route = useRoute()
  
  // Leer filtros de la URL
  const getFiltersFromURL = () => {
    return {
      status: route.query.status || '',
      categoryId: route.query.categoryId || '',
      cityId: route.query.cityId || '',
      minPrice: route.query.minPrice ? parseInt(route.query.minPrice) : null,
      maxPrice: route.query.maxPrice ? parseInt(route.query.maxPrice) : null
    }
  }

  // Convertir filtros de URL a valores de búsqueda
  const parseURLFilters = () => {
    const urlFilters = getFiltersFromURL()
    
    return {
      selectedStatus: urlFilters.status || '',
      selectedCategory: urlFilters.categoryId || '',
      selectedCity: urlFilters.cityId || '',
      selectedMinPrice: urlFilters.minPrice,
      selectedMaxPrice: urlFilters.maxPrice,
      hasFilters: Boolean(
        urlFilters.status || 
        urlFilters.categoryId || 
        urlFilters.cityId || 
        urlFilters.minPrice || 
        urlFilters.maxPrice
      )
    }
  }

  return {
    getFiltersFromURL,
    parseURLFilters
  }
}
