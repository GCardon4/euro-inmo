# 🏠 Euro Inmo - Proyecto Inmobiliario

Plataforma web para empresa inmobiliaria del Oriente Antioqueño, desarrollada con Nuxt 4, Supabase y diseño moderno UI/UX.

## ✨ Características

### Página Principal
- **Header Responsive** con menú móvil
- **Hero Section** con slider de imágenes y filtros de búsqueda
- **Grid de Propiedades** con cards interactivas
- **Información de la Empresa** con estadísticas
- **Sección de Agentes** con perfiles profesionales
- **Formulario de Contacto** completo
- **Footer** con información de contacto y redes sociales

### Funcionalidades
- Búsqueda de propiedades por tipo, ubicación y precio
- Filtros rápidos por categoría
- Cards de propiedades con información detallada
- Navegación fluida y animaciones
- Diseño 100% responsive
- SEO optimizado

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Instalar Pinia (si no está instalado)**
```bash
npm install @pinia/nuxt pinia
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
euro-inmo/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Estilos globales
│   ├── components/
│   │   ├── TheHeader.vue         # Header con navegación
│   │   ├── TheFooter.vue         # Footer
│   │   ├── HeroSection.vue       # Slider y filtros
│   │   ├── PropertiesGrid.vue    # Grid de propiedades
│   │   ├── PropertyCard.vue      # Card individual
│   │   ├── AboutSection.vue      # Info de la empresa
│   │   ├── AgentsSection.vue     # Sección de agentes
│   │   └── ContactSection.vue    # Formulario de contacto
│   ├── pages/
│   │   ├── index.vue             # Página principal
│   │   └── admin/
│   │       ├── dashboard.vue
│   │       └── createProperty.vue
│   ├── stores/
│   │   └── properties.js         # Store de Pinia para propiedades
│   └── app.vue
├── nuxt.config.ts
├── package.json
└── README.md
```

## 🎨 Componentes Principales

### TheHeader
Header sticky con menú responsive y navegación principal.

### HeroSection
- Slider automático de imágenes
- Filtros de búsqueda avanzados
- Tabs para Venta/Arriendo
- Formulario con selectores y rangos de precio

### PropertiesGrid
- Grid responsive de propiedades
- Filtros rápidos por categoría
- Paginación con "Ver más"
- Integración con PropertyCard

### PropertyCard
- Imagen con overlay
- Badges de estado y categoría
- Información: nombre, ubicación, características
- Precio formateado
- Hover effects

### AboutSection
- Diseño en 2 columnas
- Lista de características
- Estadísticas destacadas
- CTA para más información

### AgentsSection
- Cards de agentes con foto
- Información de contacto
- Estadísticas por agente
- Links directos a WhatsApp/Email

### ContactSection
- Formulario completo
- Validación de campos
- Información de contacto
- Redes sociales

## 🛠️ Tecnologías

- **Frontend**: Nuxt 4 (Vue 3)
- **Rendering**: SSR
- **Estado**: Pinia
- **Backend**: Supabase
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **Estilos**: CSS moderno con variables y animaciones

## 📝 Próximos Pasos

### Conectar con Supabase
1. Modificar `PropertiesGrid.vue` para usar el store
2. Cargar datos reales desde Supabase
3. Implementar autenticación de usuarios
4. Conectar formulario de contacto con base de datos

### Funcionalidades Pendientes
- [ ] Página de detalle de propiedad
- [ ] Página de listado completo
- [ ] Sistema de favoritos
- [ ] Compartir propiedades
- [ ] Panel administrativo completo
- [ ] Gestión de imágenes múltiples
- [ ] Mapa de ubicación
- [ ] Comparador de propiedades

## 🎯 Guía de Uso del Store

```javascript
// En cualquier componente
const propertiesStore = usePropertiesStore()

// Cargar propiedades
await propertiesStore.fetchProperties()

// Acceder a propiedades
const properties = propertiesStore.properties
const featured = propertiesStore.featuredProperties

// Aplicar filtros
propertiesStore.updateFilters({
  status: 'venta',
  categoryId: '1',
  minPrice: 100000000
})

// Obtener propiedades filtradas
const filtered = propertiesStore.filteredProperties
```

## 🎨 Personalización

### Colores
Los colores principales están definidos en los componentes. Para cambiarlos globalmente:
- Azul principal: `#2563eb`
- Azul oscuro: `#1d4ed8`
- Gris texto: `#374151`

### Fuentes
Se usa el stack de fuentes del sistema para mejor rendimiento. Puedes agregar fuentes personalizadas en `main.css`.

## 📱 Responsive

El diseño es completamente responsive con breakpoints en:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Producción

```bash
# Build
npm run build

# Preview
npm run preview

# Generate static
npm run generate
```

## 📄 Licencia

Proyecto privado - Euro Inmo © 2026

## 👥 Equipo

Desarrollado para Euro Inmo - Bienes Raíces del Oriente Antioqueño

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.
