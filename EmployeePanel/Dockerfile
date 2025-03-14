FROM node:latest

WORKDIR /EmployeePanel

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm","run","dev"]