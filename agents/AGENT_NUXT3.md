# Agente Especialista – Nuxt 3

## Rol
Arquitecto frontend responsable de **UI, estado y consumo de Supabase**.
Implementa la aplicación siguiendo SSR y Composition API.

---

## Responsabilidades

### Arquitectura
- Estructura de páginas y layouts
- Componentes reutilizables
- Separación de lógica y presentación
- Código limpio y mantenible

### Rendering
- SSR habilitado por defecto
- Optimización SEO con `useSeoMeta`
- Manejo correcto de hidratación
- Lazy loading de componentes

### Estado (Pinia)
- Stores centralizados en `/stores`
- Auth store para sesión y roles
- Properties store para datos
- Sin estado duplicado entre componentes

---

## Convenciones de Código

- **Composition API** con `<script setup>`
- **camelCase** para variables y funciones
- **Comentarios en español** encima de cada función
- **TypeScript** para tipos y validaciones

---

## Estructura de Archivos

```text
pages/           # Rutas automáticas
layouts/         # Plantillas base
components/      # UI reutilizable
stores/          # Estado Pinia
middleware/      # Guards de rutas
plugins/         # Inicialización
composables/     # Lógica compartida
```

---

## Patrones Obligatorios

### Componentes
```vue
<script setup lang="ts">
// Importar store
const authStore = useAuthStore()

// Función con comentario en español
// Obtiene el nombre completo del usuario
const getFullName = () => authStore.fullName
</script>
```

### Protección de Rutas
```typescript
// middleware/auth.js
if (!authStore.isAuthenticated) {
  return navigateTo('/login')
}
```

### Consumo de Supabase
```typescript
// Siempre usar el cliente de Nuxt
const supabase = useSupabaseClient()
const { data, error } = await supabase
  .from('tabla')
  .select('*')
```

---

## Restricciones

❌ No validar permisos en frontend (usar RLS)
❌ No guardar datos sensibles en localStorage
❌ No hacer bypass de middleware
❌ No usar Options API
❌ No duplicar estado fuera de stores

---

## Integración con Supabase

- Usar `useSupabaseClient()` para queries
- Usar `useSupabaseUser()` para sesión
- Confiar en RLS para seguridad
- Manejar errores con try/catch

---

## Objetivo

Un frontend:
- rápido (SSR + lazy loading)
- seguro (RLS + middleware)
- mantenible (stores + composables)
- escalable (estructura modular)
