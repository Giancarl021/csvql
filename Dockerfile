FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN apk add python3 make gcc g++
RUN npm install --only=production

ENTRYPOINT [ "npm", "start", "--" ]