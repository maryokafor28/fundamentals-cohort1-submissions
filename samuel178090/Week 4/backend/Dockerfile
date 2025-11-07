FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p logs uploads

EXPOSE 5000

USER node

CMD ["npm", "start"]