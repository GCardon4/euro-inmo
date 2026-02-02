# Configuración de Despliegue en Coolify

## Desarrollo Local

Para ejecutar el proyecto en local, necesitas crear un archivo `.env` en la raíz del proyecto:

```bash
SUPABASE_URL=https://kpfvjnlclaucgmjkkyvh.supabase.co
SUPABASE_KEY=tu_supabase_anon_key_aquí
NODE_ENV=development
```

**Pasos:**
1. Crea el archivo `.env` en `/var/www/euro-inmo/`
2. Agrega las variables de entorno con tus credenciales de Supabase
3. Ejecuta `npm run dev`
4. La aplicación estará disponible en `http://localhost:3000`

## Variables de Entorno Requeridas

Asegúrate de configurar las siguientes variables de entorno en Coolify:

```bash
SUPABASE_URL=https://kpfvjnlclaucgmjkkyvh.supabase.co
SUPABASE_KEY=tu_supabase_anon_key_aquí
NODE_ENV=production
```

## Pasos para Configurar en Coolify

1. **Ir a tu aplicación en Coolify**
2. **Sección Environment Variables**
3. **Agregar cada variable:**
   - Name: `SUPABASE_URL`
   - Value: `https://kpfvjnlclaucgmjkkyvh.supabase.co`
   
   - Name: `SUPABASE_KEY`
   - Value: (Tu Supabase Anon Key desde el panel de Supabase)
   
   - Name: `NODE_ENV`
   - Value: `production`

4. **Guardar cambios**
5. **Redesplegar la aplicación**

## Obtener las Credenciales de Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/kpfvjnlclaucgmjkkyvh
2. Ve a **Settings** > **API**
3. Copia:
   - **Project URL** → para `SUPABASE_URL`
   - **anon public** key → para `SUPABASE_KEY`

## Verificar el Despliegue

Después de configurar las variables y redesplegar:

1. La aplicación debe cargar sin errores 500
2. Verifica que el favicon se carga correctamente
3. Comprueba que la página principal se renderiza

## Solución de Problemas

### Error 500 persiste
1. Verifica los logs en Coolify: `Logs` > `Build Logs` y `Application Logs`
2. Asegúrate de que las variables de entorno están configuradas correctamente
3. Verifica que no hay espacios extra en las variables
4. Revisa que el `SUPABASE_KEY` es el correcto (anon/public key, no service_role)

### Favicon no carga
- El favicon está en `/public/favicon.ico`
- Si persiste el error, limpia la caché del navegador

### Errores de conexión a Supabase
- Verifica que la URL de Supabase es correcta
- Comprueba que el proyecto de Supabase está activo
- Verifica las políticas RLS en Supabase para las tablas públicas
