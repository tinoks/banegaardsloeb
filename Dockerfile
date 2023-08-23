FROM node:18

WORKDIR /usr/src/app

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
