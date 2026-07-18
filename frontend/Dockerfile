# --- Ambiente de desenvolvimento (Vite dev server + HMR) ---
FROM node:22-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
# Polling: necessário para o HMR detectar mudanças em volumes no Windows/Docker.
ENV CHOKIDAR_USEPOLLING=true
COPY package.json package-lock.json* ./
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
