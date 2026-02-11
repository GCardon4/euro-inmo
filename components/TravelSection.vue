<template>
  <section class="travel-section">
    <div class="container">
      <div class="travel-grid">
        <!-- Columna izquierda: Información -->
        <div class="travel-content">
          <h2 class="travel-title">Euro Viajes</h2>
          <p class="travel-description">
            Descubre el mundo con <strong>Euro Viajes</strong>, nuestra agencia de viajes con las mejores
            promociones y destinos para que vivas experiencias inolvidables. Te ayudamos a planificar
            tus vacaciones de principio a fin con atención personalizada y los mejores precios.
          </p>

          <!-- Features -->
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="public" />
              </div>
              <div class="feature-text">
                <h4>Destinos Nacionales e Internacionales</h4>
                <p>Viaja por Colombia o al exterior con los mejores planes</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="local_offer" />
              </div>
              <div class="feature-text">
                <h4>Promociones Actualizadas</h4>
                <p>Ofertas exclusivas y tarifas especiales todo el año</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="support_agent" />
              </div>
              <div class="feature-text">
                <h4>Asesoría Personalizada</h4>
                <p>Te acompañamos en cada paso para armar tu viaje ideal</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="beach_access" />
              </div>
              <div class="feature-text">
                <h4>Planes Todo Incluido</h4>
                <p>Paquetes completos con vuelos, hospedaje y actividades</p>
              </div>
            </div>
          </div>

          <!-- Botón WhatsApp (estilo icono azul como en proyectos) -->
          <div class="travel-actions">
            <a
              href="https://wa.me/573028577777?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20los%20paquetes%20de%20Euro%20Viajes."
              target="_blank"
              rel="noopener noreferrer"
              class="share-icon-btn"
              title="Contactar Euro Viajes"
            >
              <img src="/white-whatsapp.png" alt="WhatsApp" class="share-wa-icon">
            </a>
            <span>Contáctanos por WhatsApp</span>
          </div>
        </div>

        <!-- Columna derecha: Imagen + Logo -->
        <div class="travel-image">
          <img
            src="/euro-viajes-post.jpg"
            alt="Euro Viajes - Agencia de Viajes"
            class="main-image"
          >
          <div class="image-badge">
            <img
              src="/euro-viajes-logo.png"
              alt="Euro Viajes Logo"
              class="badge-image"
            >
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
.travel-section {
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f0f8fc 0%, #e6f2f8 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.travel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.travel-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.travel-label {
  color: #0b6182;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.travel-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e1e1c;
  line-height: 1.2;
  margin: 0;
}

.travel-description {
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

/* Botón WhatsApp - estilo icono azul como en ProjectSection */
.travel-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.travel-actions span {
  color: #0b6182;
  font-weight: 600;
  font-size: 1rem;
}

.share-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0b6182;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.share-icon-btn:hover {
  background: #094d68;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(11, 97, 130, 0.3);
}

.share-wa-icon {
  width: 22px;
  height: 22px;
}

/* Columna derecha: imagen principal + badge logo */
.travel-image {
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
  left: 2rem;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
}

.badge-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

/* Responsive */
@media (max-width: 1024px) {
  .travel-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .main-image {
    height: 400px;
  }

  .travel-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .travel-section {
    padding: 3rem 1rem;
  }

  .travel-grid {
    gap: 2rem;
  }

  .main-image {
    height: 300px;
  }

  .image-badge {
    bottom: 1rem;
    left: 1rem;
  }

  .badge-image {
    width: 110px;
    height: 110px;
  }

  .travel-title {
    font-size: 1.75rem;
  }

  .travel-description {
    font-size: 1rem;
  }
}
</style>
