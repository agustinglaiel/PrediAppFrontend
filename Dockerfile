# frontend/Dockerfile.dev
FROM node:18-alpine

# 1) Don’t overwrite local node_modules
VOLUME ["/app/node_modules"]

WORKDIR /app

# 2) Trae solo package.json + lock y deja cache de deps
COPY package.json package-lock.json ./
RUN npm install

# 3) Exponer el puerto de Vite
EXPOSE 5173

# 4) Arrancar el dev‑server en 0.0.0.0 para que sea accesible desde fuera
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
