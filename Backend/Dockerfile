FROM node

WORKDIR /Backend

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "node","server.js" ]