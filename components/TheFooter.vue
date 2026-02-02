<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Columna 1: Información de la empresa -->
      <div class="footer-column">
        <div class="footer-logo">
          <img src="/logotipo-euro.svg" alt="Euro Inmo Logo" class="footer-logo-img" />
          <h3 class="footer-title">Euro Inmo</h3>
        </div>
        <p class="footer-text">
          Líder en bienes raíces del Oriente Antioqueño. 
          Más de 10 años conectando personas con sus hogares ideales.
        </p>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Facebook">
            <Icon name="facebook" />
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <Icon name="photo_camera" />
          </a>
          <a href="#" class="social-link" aria-label="WhatsApp">
            <Icon name="chat" />
          </a>
        </div>
      </div>

      <!-- Columna 2: Enlaces rápidos -->
      <div class="footer-column">
        <h4 class="footer-subtitle">Enlaces Rápidos</h4>
        <ul class="footer-links">
          <li><NuxtLink to="/">Inicio</NuxtLink></li>
          <li><NuxtLink to="/properties">Propiedades</NuxtLink></li>
          <li><NuxtLink to="/about">Nosotros</NuxtLink></li>
          <li><NuxtLink to="/contact">Contacto</NuxtLink></li>
        </ul>
      </div>

      <!-- Columna 3: Categorías -->
      <div class="footer-column">
        <h4 class="footer-subtitle">Categorías</h4>
        <ul class="footer-links">
          <li><a href="#">Apartamentos</a></li>
          <li><a href="#">Casas</a></li>
          <li><a href="#">Fincas</a></li>
          <li><a href="#">Locales</a></li>
          <li><a href="#">Lotes</a></li>
        </ul>
      </div>

      <!-- Columna 4: Contacto -->
      <div class="footer-column">
        <h4 class="footer-subtitle">Contacto</h4>
        <ul class="footer-contact">
          <li>
            <Icon name="location_on" custom-class="icon" />
            <span>Oriente Antioqueño, Colombia</span>
          </li>
          <li>
            <Icon name="phone" custom-class="icon" />
            <span>+57 (604) 123 4567</span>
          </li>
          <li>
            <Icon name="email" custom-class="icon" />
            <span>info@euroinmo.com</span>
          </li>
          <li>
            <Icon name="schedule" custom-class="icon" />
            <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Euro Inmo. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
// Año actual para copyright
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #0b6182 0%, #1e1e1c 100%);
  color: white;
  padding: 4rem 2rem 1rem;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.footer-logo-img {
  height: 50px;
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.footer-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: white;
}

.footer-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: white;
  transform: translateX(5px);
}

.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
}

.footer-contact .icon {
  font-size: 20px;
  flex-shrink: 0;
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

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  color: white;
}

.social-link .material-icons {
  font-size: 20px;
}

.social-link:hover {
  background: rgba(130, 186, 211, 0.3);
  transform: translateY(-3px);
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 3rem 1rem 1rem;
  }

  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
