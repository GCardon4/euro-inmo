<template>
  <section class="agents-section">
    <div class="container">
      <!-- Título de la sección -->
      <div class="section-header">
        <span class="section-label">Nuestro Equipo</span>
        <h2 class="section-title">Conoce a Nuestros Asesores</h2>
        <p class="section-subtitle">
          Profesionales expertos listos para ayudarte a encontrar tu propiedad ideal
        </p>
      </div>

      <!-- Grid de agentes -->
      <div class="agents-grid">
        <div 
          v-for="agent in agents" 
          :key="agent.id"
          class="agent-card"
        >
          <div class="agent-image-container">
            <img 
              :src="agent.photo" 
              :alt="agent.name"
              class="agent-photo"
            >

          </div>

          <div class="agent-info">
            <h3 class="agent-name">{{ agent.name }}</h3>
            <p class="agent-role">{{ agent.role }}</p>
            
            <div class="agent-stats">
              <div class="stat">
                <Icon name="home" custom-class="stat-icon" />
                <span class="stat-text">{{ agent.properties }} propiedades</span>
              </div>
              <div class="stat">
                <Icon name="star" custom-class="stat-icon" />
                <span class="stat-text">{{ agent.rating }} rating</span>
              </div>
            </div>

            <p class="agent-description">{{ agent.description }}</p>

            <a :href="agent.whatsapp" target="_blank" class="btn-contact">
              Contactar Asesor
            </a>
          </div>
        </div>
      </div>

      <!-- Llamado a la acción -->
      <div class="agents-cta">
        <h3>¿Necesitas asesoría personalizada?</h3>
        <p>Nuestro equipo está listo para ayudarte</p>
        <NuxtLink to="/contact" class="btn-primary">
          Contáctanos Ahora
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// Lista de agentes (TODO: Conectar con API/Supabase)
const agents = ref([
  {
    id: 1,
    name: 'Valentina Florez',
    role: 'Asesora Arriendos',
    photo: '/asesores/asesor-01.jpeg',
    properties: 45,
    rating: '4.9',
    description: 'Especialista en propiedades residenciales del Oriente Antioqueño con 8 años de experiencia.',
    whatsapp: 'https://wa.me/573012421919'
  },
  {
    id: 2,
    name: 'Mayerly Martínez',
    role: 'Contabilidad',
    photo: '/asesores/asesor-02.jpeg',
    properties: 38,
    rating: '4.8',
    description: 'Experto en fincas y propiedades rurales. Conocimiento profundo del mercado regional.',
    whatsapp: 'https://wa.me/573236536666'
  },
  {
    id: 3,
    name: 'Leidy Gil',
    role: 'Asesora Ventas',
    photo: '/asesores/asesor-03.jpeg',
    properties: 52,
    rating: '5.0',
    description: 'Líder en ventas de apartamentos y locales comerciales. Atención personalizada garantizada.',
    whatsapp: 'https://wa.me/573507776633'
  },
   {
    id: 4,
    name: 'Natalia López',
    role: 'Asesora Inmobiliaria',
    photo: '/asesores/asesor-04.jpeg',
    properties: 28,
    rating: '4.7',
    description: 'Líder en ventas de apartamentos y locales comerciales. Atención personalizada garantizada.',
    whatsapp: 'https://wa.me/573236536666'
  }
])
</script>

<style scoped>
.agents-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-label {
  color: #2563eb;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0.5rem 0 1rem 0;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 4rem;
}

.agent-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.agent-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.agent-image-container {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
}

.agent-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.agent-card:hover .agent-photo {
  transform: scale(1.1);
}

.agent-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.agent-card:hover .agent-overlay {
  opacity: 1;
}

.agent-social {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 45px;
  height: 45px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  transform: translateY(20px);
  color: #0b6182;
}

.social-icon .material-icons {
  font-size: 20px;
}

.agent-card:hover .social-icon {
  transform: translateY(0);
}

.social-icon:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.agent-info {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.agent-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e1e1c;
  margin: 0;
}

.agent-role {
  color: #0b6182;
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
}

.agent-stats {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 20px;
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'liga';
}

.stat-text {
  color: #585857;
  font-size: 0.875rem;
  font-weight: 500;
}

.agent-description {
  color: #585857;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.btn-contact {
  padding: 0.875rem 1.5rem;
  background: #0b6182;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-contact:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.agents-cta {
  background: #0b6182;
  padding: 4rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  color: white;
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.3);
}

.agents-cta h3 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: white;
}

.agents-cta p {
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
}

.btn-primary {
  display: inline-block;
  padding: 1.25rem 3rem;
  background: white;
  color: #2563eb;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .agents-section {
    padding: 3rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .agents-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .agent-image-container {
    height: 280px;
  }

  .agents-cta {
    padding: 3rem 1.5rem;
  }

  .agents-cta h3 {
    font-size: 1.5rem;
  }

  .agents-cta p {
    font-size: 1rem;
  }
}
</style>
