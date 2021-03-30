FROM openjdk:15-alpine

RUN apk add --update nodejs nodejs-npm

RUN npm install -g grunt grunt-cli

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080
CMD ["npm", "start"]