# Variables de Entorno para Coolify

Para que la aplicación funcione correctamente en Coolify, debes configurar las siguientes variables de entorno:

## Variables Requeridas

1. **SUPABASE_URL**
   - Descripción: URL de tu proyecto de Supabase
   - Ejemplo: `https://kpfvjnlclaucgmjkkyvh.supabase.co`
   - Dónde encontrarlo: Supabase Dashboard > Project Settings > API > Project URL

2. **SUPABASE_KEY**
   - Descripción: Anon Key de tu proyecto de Supabase
   - Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Dónde encontrarlo: Supabase Dashboard > Project Settings > API > Project API keys > anon public

3. **NODE_ENV**
   - Valor: `production`
   - Descripción: Indica que la aplicación está en producción

## Cómo Configurar en Coolify

1. Ve a tu aplicación en Coolify
2. Click en "Environment Variables"
3. Agrega cada variable con su valor correspondiente:
   ```
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_KEY=tu-anon-key-completa-aqui
   NODE_ENV=production
   ```
4. Guarda los cambios
5. Redespliega la aplicación

## Verificación

Después de configurar las variables y redesplegar, verifica que:
- La página inicial carga correctamente
- El grid de propiedades muestra datos de Supabase
- No hay errores en la consola del navegador sobre variables de entorno

## Solución de Problemas

### Error: "Cannot read properties of undefined"
- Verifica que SUPABASE_URL y SUPABASE_KEY estén configuradas correctamente
- Asegúrate de que no haya espacios al inicio o final de los valores

### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Verifica que la key sea la "anon public" key, no la service_role key
- Verifica que tu proyecto de Supabase esté activo

### Warning: "Retrying fetch attempt"
- Este es un warning normal durante el inicio de la aplicación
- Si persiste, verifica la configuración de Supabase
