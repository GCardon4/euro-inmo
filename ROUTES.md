# Estructura de Rutas del Proyecto

## Rutas Públicas

### Páginas Principales
- `/` - Página principal (index.vue)
- `/properties` - Listado de todas las propiedades (properties.vue)
- `/about` - Información sobre la empresa (about.vue)
- `/contact` - Página de contacto (contact.vue)
- `/login` - Página de inicio de sesión (login.vue)

### Propiedades Individuales
- `/property-[code]` - Detalle de propiedad por código (property-[code]/index.vue)
  - Ejemplo: `/property-CS001` muestra la propiedad con código CS001

## Rutas Administrativas (Requieren autenticación)

### Dashboard
- `/admin/dashboard` - Panel principal administrativo (admin/dashboard.vue)

### Gestión de Propiedades
- `/admin/properties` - Listado de propiedades (admin/properties/index.vue)
- `/admin/properties/create` - Crear nueva propiedad (admin/properties/create.vue)

### Gestión de Catálogos
- `/admin/categories` - Gestión de categorías (admin/categories/index.vue)
- `/admin/amenities` - Gestión de características (admin/amenities/index.vue)
- `/admin/locations` - Gestión de ubicaciones (admin/locations/index.vue)
- `/admin/agents` - Gestión de agentes (admin/agents/index.vue)

## Configuración de Redirección

Las rutas administrativas están protegidas por autenticación en `nuxt.config.ts`:

```typescript
redirectOptions: {
  login: '/login',
  callback: '/confirm',
  exclude: ['/', '/property-*', '/contact', '/properties', '/about']
}
```

### Rutas Excluidas de Autenticación
- Página principal: `/`
- Propiedades: `/properties` y `/property-*`
- Contacto: `/contact`
- Nosotros: `/about`
- Login: `/login` (implícito)

### Rutas Protegidas (Requieren login)
- Todo bajo `/admin/**`
- Cualquier otra ruta no excluida explícitamente

## Arquitectura de Archivos

```
pages/
├── index.vue                    # Página principal
├── properties.vue               # Listado de propiedades
├── about.vue                    # Sobre nosotros
├── contact.vue                  # Contacto
├── login.vue                    # Login
├── property-[code]/             # Rutas dinámicas de propiedades
│   └── index.vue                # Detalle de propiedad
└── admin/                       # Área administrativa
    ├── dashboard.vue            # Dashboard principal
    ├── agents/
    │   └── index.vue
    ├── amenities/
    │   └── index.vue
    ├── categories/
    │   └── index.vue
    ├── locations/
    │   └── index.vue
    └── properties/
        ├── index.vue            # Lista de propiedades admin
        └── create.vue           # Crear propiedad
```

## Próximas Rutas a Implementar

- `/admin/properties/edit/[id]` - Editar propiedad existente
- `/admin/users` - Gestión de usuarios
- `/admin/profile` - Perfil del usuario actual
- `/confirm` - Callback de confirmación de email

## Notas Importantes

1. **Parámetros dinámicos**: Los corchetes `[]` indican parámetros dinámicos
   - `property-[code]` captura cualquier código de propiedad
   
2. **Archivos index.vue**: Representan la ruta raíz del directorio
   - `admin/properties/index.vue` → `/admin/properties`
   - `admin/properties/create.vue` → `/admin/properties/create`

3. **SSR**: Todas las rutas tienen SSR habilitado por defecto

4. **Cache**: Los assets estáticos tienen cache configurado en `nitro.routeRules`
