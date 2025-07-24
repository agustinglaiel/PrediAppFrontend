# ─────────────────────────────────────────────────────────────
# Etapa 1: Builder (Node + Vite)
# ─────────────────────────────────────────────────────────────
FROM node:18.17.1-alpine3.18 AS builder

# Parchear Alpine
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# 1) Copiar lock + package
COPY package.json package-lock.json ./

# 2) Instalar dependencias con npm install en lugar de ci
RUN npm install

# 3) (Opcional) auto‑arreglar vulnerabilidades JS
RUN npm audit fix --force || true

# 4) Copiar el resto y compilar la app
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Etapa 2: Runtime (NGINX)
# ─────────────────────────────────────────────────────────────
FROM nginx:1.25.4-alpine3.18 AS runtime

# Parchear Alpine
RUN apk update && apk upgrade --no-cache

# Reemplazar la configuración global de Nginx con tu nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
