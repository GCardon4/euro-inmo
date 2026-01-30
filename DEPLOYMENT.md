# Euro Inmo - Deployment Guide

## 🚀 Despliegue en Coolify

### 1. Configurar Repositorio en Coolify

#### Opción A: Usar SSH (Recomendado)
```
git@github.com:GCardon4/euro-inmo.git
```

#### Opción B: Usar HTTPS con Token
1. Crear Personal Access Token en GitHub:
   - GitHub → Settings → Developer settings → Personal access tokens
   - Generar token con permisos `repo`
2. Usar URL con token:
   ```
   https://TOKEN@github.com/GCardon4/euro-inmo
   ```

### 2. Variables de Entorno en Coolify

Configura las siguientes variables de entorno en tu servicio de Coolify:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-aqui
NODE_ENV=production
```

### 3. Configuración del Puerto

Coolify detectará automáticamente el puerto 3000 que usa Nuxt. Si necesitas cambiarlo, agrega:

```env
PORT=3000
```

### 4. Build Settings

Coolify usará automáticamente `nixpacks.toml` que ya está configurado:
- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`

### 5. Verificar Despliegue

Una vez desplegado, verifica:
- ✅ La aplicación está corriendo
- ✅ El login funciona con Supabase
- ✅ Las rutas protegidas requieren autenticación
- ✅ El dashboard carga correctamente

## 🔧 Solución de Problemas

### Error: "could not read Username for 'https://github.com'"
**Solución**: Cambiar a SSH o usar token de GitHub en la URL

### Error: "npm start not found"
**Solución**: Ya agregado en package.json, hacer git pull

### Error de Supabase en producción
**Solución**: Verificar variables de entorno SUPABASE_URL y SUPABASE_KEY

### Build falla
**Solución**: Verificar que Node.js 20 esté configurado en Coolify

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm start        # Iniciar servidor de producción
npm run preview  # Preview del build
```

## 🔗 Enlaces Importantes

- **Repositorio**: https://github.com/GCardon4/euro-inmo
- **Documentación Nuxt**: https://nuxt.com/docs
- **Documentación Supabase**: https://supabase.com/docs
- **Documentación Coolify**: https://coolify.io/docs
