
FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install pg

COPY . .

CMD ["npm","start"]