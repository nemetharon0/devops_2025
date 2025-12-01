FROM node:lts-alpine AS builder
WORKDIR /app

COPY package*.json  ./

RUN npm install

COPY . .

EXPOSE 5050

CMD ["node", "server.js"]
