FROM node:18

WORKDIR /usr/src/app

RUN npm i

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
