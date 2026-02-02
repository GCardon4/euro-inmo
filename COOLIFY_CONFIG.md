# Configuración de Coolify para Euro Inmo

## Build Method

Coolify ahora usará el **Dockerfile** incluido en el proyecto para hacer el build.

## Variables de Entorno Requeridas en Coolify

```bash
SUPABASE_URL=https://kpfvjnlclaucgmjkkyvh.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
NODE_ENV=production
```

Las variables NITRO_PORT y NITRO_HOST ya están configuradas en el Dockerfile.

## Configuración del Puerto

- Puerto expuesto: **3000**
- Asegúrate de que Coolify mapee correctamente el puerto 3000

## Proceso de Build

El Dockerfile:
1. Copia `.output` (resultado del build de Nuxt)
2. Instala solo dependencias de producción
3. Expone puerto 3000
4. Inicia el servidor Nitro

## Importante

Asegúrate de que en Coolify:
1. El puerto expuesto sea **3000**
2. Las variables de entorno estén configuradas
3. El comando de inicio sea: `node .output/server/index.mjs`

## Logs a revisar

Si los assets dan error 500, verifica en Application Logs:
- Que el servidor inicie correctamente
- Que no haya errores de permisos en .output/public
- Que Nitro esté sirviendo archivos estáticos
