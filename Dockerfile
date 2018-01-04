FROM node:alpine

COPY . /

CMD node index.js

EXPOSE 8080