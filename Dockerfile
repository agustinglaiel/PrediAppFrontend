# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

WORKDIR /app

# 1) Copiamos sólo package.json y lock para cachear deps
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copiamos el resto del código y generamos la build
COPY . .
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM nginx:stable-alpine

# 3) Copiamos los archivos generados al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 4) (Opcional) Si tienes reglas de SPA (history fallback), puedes customizar:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 5) Exponemos el puerto (por defecto Nginx escucha en 80)
EXPOSE 80

# 6) Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
