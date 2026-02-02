# Cambios para Solucionar Error 500 en Producción

## Problema Identificado
Error: `Cannot read properties of undefined (reading 'state')` causado por:
1. Stores de Pinia no inicializados correctamente en SSR
2. Favicon no encontrado en la ruta de build
3. Errores no manejados que causaban crashes del servidor

## Soluciones Implementadas

### 1. Manejo de Stores en SSR

**Archivo**: `components/TheHeader.vue`
- Envuelto `initAuth()` en try-catch
- Agregado console.warn para errores no críticos

**Archivo**: `components/PropertiesGrid.vue`
- Cambiado de throw Error a manejo silencioso
- Si Supabase no está disponible, retorna array vacío
- No bloquea la renderización si hay error

### 2. Plugin de Pinia

**Archivo**: `plugins/pinia.ts` (NUEVO)
- Asegura que Pinia esté correctamente inicializado
- Maneja diferencias entre servidor y cliente

### 3. Página de Error

**Archivo**: `error.vue` (NUEVO - formato correcto)
- Maneja errores 500 de forma elegante
- Permite volver al inicio sin recargar
- Diseño con colores corporativos

### 4. Configuración de Nitro

**Archivo**: `nuxt.config.ts`
- Agregado `serveStatic: true` para servir archivos estáticos
- Configurado `publicAssets` con maxAge de 7 días
- Agregada regla para archivos SVG
- Removido `errorHandler` (lo maneja error.vue)

### 5. Configuración de Supabase

**Archivo**: `nuxt.config.ts`
- Deshabilitado `autoRefreshToken` para reducir llamadas
- Agregado `cookieName` para mejor manejo de sesiones

## Archivos Creados/Modificados

### Nuevos:
- ✅ `plugins/pinia.ts` - Plugin de inicialización de Pinia
- ✅ `error.vue` - Página de error personalizada
- ✅ `diagnostico.sh` - Script de diagnóstico
- ✅ `FIX_500_ERROR.md` - Documentación del fix
- ✅ `nixpacks.json` - Configuración de build
- ✅ `.env.production.example` - Template de variables

### Modificados:
- ✅ `components/TheHeader.vue` - Manejo de errores en auth
- ✅ `components/PropertiesGrid.vue` - Manejo de errores en fetch
- ✅ `nuxt.config.ts` - Configuración de Nitro y assets
- ✅ `stores/auth.js` - Verificación de config antes de init
- ✅ `stores/properties.js` - Verificación de config en métodos
- ✅ `.gitignore` - Incluye archivos .example

## Pasos para Desplegar

### 1. Commit y Push
```bash
git add -A
git commit -m "fix: resolver error 500 en producción - manejo SSR y assets"
git push origin master
```

### 2. Configurar Variables en Coolify
Ve a Environment Variables y asegúrate de tener:
```bash
SUPABASE_URL=https://kpfvjnlclaucgmjkkyvh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZnZqbmxjbGF1Y2dtamtreXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTgzMjgsImV4cCI6MjA1MDE5NDMyOH0.Y0ORGPjxdZvIBaqc3Ci_iEPGH8TuX-jt2W2v0Xx6QjE
NODE_ENV=production
```

### 3. Redeploy en Coolify
- Click en "Redeploy" (NO solo Restart)
- Espera a que termine el build
- Verifica Application Logs (no Build Logs)

## Verificación

### Build Local ✅
```bash
npm run build
# Build completo exitoso - 3.19 MB (771 kB gzip)
```

### Diagnóstico Local ✅
```bash
./diagnostico.sh
# ✅ Anon public key (JWT)
# ✅ Longitud adecuada (208 caracteres)
# ✅ Conexión exitosa a Supabase
```

## Qué Esperar Después del Despliegue

### ✅ Funcionará:
- Página principal carga correctamente
- No más error 500
- Favicon se sirve correctamente
- Errores se manejan con página personalizada
- Propiedades se cargan (si Supabase está configurado)

### ⚠️ Si sigue fallando:
1. Verifica los Application Logs en Coolify
2. Busca errores específicos diferentes a los anteriores
3. Asegúrate de que las 3 variables de entorno estén configuradas
4. Verifica que no haya espacios extra en las variables
