FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js", "--config", "config.local.yaml", "--host", "0.0.0.0", "--port", "3000"]
