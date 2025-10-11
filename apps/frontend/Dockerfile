FROM node:18-alpine AS development

WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./

RUN npm install
COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
