FROM node:alpine

WORKDIR /client

COPY package.json package.json
RUN npm install

COPY . /app

CMD npm run build
