FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN npm install --only=production

ENTRYPOINT [ "npm start" ]