<template>
  <section class="about-section">
    <div class="container">
      <div class="about-grid">
        <!-- Columna izquierda: Imagen -->
        <div class="about-image">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
            alt="Oficina Euro Inmobiliaria"
            class="main-image"
          >
          <div class="image-badge">
            <img
              src="/label-euro.png"
              alt="Euro Inmobiliaria - 14 años acompañando familias"
              class="badge-image"
            >
          </div>
        </div>

        <!-- Columna derecha: Información -->
        <div class="about-content">
          <h2 class="about-title">Tu aliado en bienes raíces del Oriente Antioqueño</h2>
          <p class="about-description">
            En <strong>Euro Inmobiliaria</strong> somos expertos en el mercado inmobiliario del Oriente Antioqueño. 
            Con más de una década de experiencia, hemos ayudado a cientos de familias a encontrar 
            su hogar ideal y a inversionistas a hacer realidad sus proyectos.
          </p>

          <!-- Valores/Características -->
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="check_circle" />
              </div>
              <div class="feature-text">
                <h4>Amplio Portafolio</h4>
                <p>Más de 500 propiedades disponibles en toda la región</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="check_circle" />
              </div>
              <div class="feature-text">
                <h4>Asesoría Personalizada</h4>
                <p>Acompañamiento profesional en cada paso del proceso</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="check_circle" />
              </div>
              <div class="feature-text">
                <h4>Procesos Seguros</h4>
                <p>Garantizamos transparencia y legalidad en todas nuestras transacciones</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="check_circle" />
              </div>
              <div class="feature-text">
                <h4>Cobertura Regional</h4>
                <p>Presencia en Rionegro, La Ceja, El Retiro, Marinilla y más</p>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">Propiedades</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">1,000+</span>
              <span class="stat-label">Clientes Satisfechos</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">15+</span>
              <span class="stat-label">Municipios</span>
            </div>
          </div>


        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No se requiere lógica adicional por ahora
</script>

<style scoped>
.about-section {
  padding: 5rem 2rem;
  background: white;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-image {
  position: relative;
}

.main-image {
  width: 100%;
  height: 600px;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.image-badge {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
}

.badge-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-label {
  color: #0b6182;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e1e1c;
  line-height: 1.2;
  margin: 0;
}

.about-description {
  font-size: 1.125rem;
  color: #585857;
  line-height: 1.8;
  margin: 0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #dbeafe;
  color: #0b6182;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.feature-icon .material-icons {
  font-size: 24px;
}

.feature-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e1e1c;
}

.feature-text p {
  margin: 0;
  color: #585857;
  font-size: 0.95rem;
  line-height: 1.5;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem 0;
  border-top: 2px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0b6182;
  line-height: 1;
}

.stat-label {
  color: #585857;
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.about-cta {
  margin-top: 1rem;
}

.btn-primary {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .main-image {
    height: 400px;
  }

  .about-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 3rem 1rem;
  }

  .about-grid {
    gap: 2rem;
  }

  .main-image {
    height: 300px;
  }

  .image-badge {
    bottom: 1rem;
    right: 1rem;
  }

  .badge-image {
    width: 110px;
    height: 110px;
  }

  .about-title {
    font-size: 1.75rem;
  }

  .about-description {
    font-size: 1rem;
  }

  .stats {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
