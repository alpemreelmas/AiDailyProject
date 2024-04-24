#build Stage 
FROM node:18-alpine AS build

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run  build

#prod stage
FROM node:18-alpine

WORKDIR /src

COPY --from=build /dist ./dist

COPY package*.json ./

RUN npm install --only=production

RUN rm package*.json

EXPOSE 3000

CMD ["node", "dist/main.js"]