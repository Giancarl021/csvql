FROM linuxbrew/brew

WORKDIR /usr/app

COPY . .

RUN brew install textql
RUN brew install node

RUN mkdir /volume
RUN npm install --only=production

CMD [ "npm", "start" ]