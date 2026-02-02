<template>
  <div class="property-card" @click="goToProperty">
    <div class="property-image-container">
      <!-- Imagen de la propiedad -->
      <img 
        :src="property.imageUrl || placeholderImage" 
        :alt="property.name"
        class="property-image"
      >
      
      <!-- Badge de estado (Venta/Arriendo) -->
      <span class="property-badge" :class="statusClass">
        {{ property.status }}
      </span>

      <!-- Badge de categoría -->
      <span class="property-category">
        {{ property.category }}
      </span>
    </div>

    <div class="property-info">
      <!-- Nombre de la propiedad -->
      <h3 class="property-name">{{ property.name }}</h3>

      <!-- Ubicación -->
      <p class="property-location">
        <Icon name="location_on" custom-class="icon" />
        <span>{{ property.location }}</span>
      </p>

      <!-- Características principales -->
      <div class="property-features" v-if="property.bedrooms || property.bathrooms || property.area">
        <span v-if="property.bedrooms" class="feature">
          <Icon name="bed" custom-class="icon" />
          <span>{{ property.bedrooms }} hab.</span>
        </span>
        <span v-if="property.bathrooms" class="feature">
          <Icon name="bathtub" custom-class="icon" />
          <span>{{ property.bathrooms }} baños</span>
        </span>
        <span v-if="property.area" class="feature">
          <Icon name="square_foot" custom-class="icon" />
          <span>{{ property.area }} m²</span>
        </span>
      </div>

      <!-- Precio -->
      <div class="property-price">
        <span class="price">{{ formattedPrice }}</span>
        <span v-if="property.status === 'Arriendo'" class="price-period">/mes</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props de la propiedad
const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

// Imagen placeholder
const placeholderImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'

// Clase CSS según el estado
const statusClass = computed(() => {
  return props.property.status === 'Venta' ? 'badge-sale' : 'badge-rent'
})

// Formatear precio con separadores de miles
const formattedPrice = computed(() => {
  if (!props.property.price) return 'Precio a consultar'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.property.price)
})

// Navegar a detalle de propiedad
const goToProperty = () => {
  if (props.property.code) {
    navigateTo(`/property-${props.property.code}/${props.property.code}`)
  }
}
</script>

<style scoped>
.property-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.property-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.property-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .property-image {
  transform: scale(1.1);
}

.property-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.badge-sale {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.badge-rent {
  background: rgba(37, 99, 235, 0.9);
  color: white;
}

.property-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.property-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.property-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e1e1c;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #585857;
  margin: 0;
  font-size: 0.95rem;
}

.property-location .icon {
  font-size: 18px;
  color: #82bad3;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}

.property-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #585857;
  font-size: 0.9rem;
  font-weight: 500;
}

.feature .icon {
  font-size: 18px;
  color: #0b6182;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}

.property-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-top: auto;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0b6182;
}

.price-period {
  color: #585857;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .property-image-container {
    height: 200px;
  }

  .property-name {
    font-size: 1.1rem;
  }

  .price {
    font-size: 1.25rem;
  }
}
</style>
