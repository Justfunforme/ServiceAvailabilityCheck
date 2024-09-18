FROM node:22.6.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

RUN apt-get update -y
RUN apt-get install -y iputils-ping
CMD ["node", "--env-file=.env", "server.js"]