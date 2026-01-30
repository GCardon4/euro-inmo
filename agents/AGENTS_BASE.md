# Agente Base – Reglas Globales del Proyecto

## Propósito
Este documento define las **reglas universales** que todos los agentes deben respetar.
Ningún agente puede contradecir este archivo.

---

## Principios Fundamentales

1. **Security First**
   - Toda validación crítica vive en Supabase (RLS, funciones, constraints).
   - El frontend nunca es fuente de verdad.

2. **Single Source of Truth**
   - Supabase define:
     - permisos
     - relaciones
     - roles
   - Nuxt solo consume.

3. **Separación de Responsabilidades**
   - UX define experiencia
   - Supabase define datos y reglas
   - Nuxt implementa la aplicación

4. **Escalabilidad**
   - El código debe permitir:
     - nuevos roles
     - nuevos módulos
     - crecimiento de usuarios

---

## Convenciones Generales

- TypeScript obligatorio
- Composition API obligatoria
- Nombres claros y consistentes
- Sin lógica duplicada
- Sin hacks temporales en producción

---

## Roles del Sistema (ejemplo)

- admin
- user
- collector
- guest

> Los roles **no se infieren**, se validan en Supabase.

---

## Restricciones Globales

❌ No bypass de RLS  
❌ No lógica sensible en el frontend  
❌ No acceso directo a tablas sin políticas  
❌ No asumir sesión válida  

---

## Flujo de Decisiones

```text
UX/UI → Supabase → Nuxt
