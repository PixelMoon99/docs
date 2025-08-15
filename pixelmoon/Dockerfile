# Dockerfile for Pixelmoon Node app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
# Build frontend if present
WORKDIR /app/Pixelmoon-Code
RUN if [ -f package.json ]; then npm install && npm run build; fi
WORKDIR /app
EXPOSE 5000
CMD ["node", "server.js"]
