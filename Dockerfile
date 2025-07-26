# ─────────────────────────────────────────────────────────────
# Etapa 1: Build (Node + Vite)
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app
# 1) Sólo package.json y lock para cachear deps
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copiar el resto y compilar
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Etapa 2: Runtime (serve estáticos con 'serve')
# ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS runtime

WORKDIR /app
# 3) Traer el build generado
COPY --from=build /app/dist ./dist

# 4) Instalar un servidor estático ligero
RUN npm install -g serve

# 5) Exponer el puerto 5173
EXPOSE 5173

# 6) Servir la carpeta ./dist en producción
CMD ["serve", "-s", "dist", "-l", "5173"]
