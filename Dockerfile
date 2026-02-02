FROM node:22-alpine

WORKDIR /app

# Copiar archivos del build
COPY .output /app/.output
COPY package.json /app/

# Instalar solo dependencias de producción
RUN npm install --production --ignore-scripts

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Iniciar servidor
CMD ["node", ".output/server/index.mjs"]
