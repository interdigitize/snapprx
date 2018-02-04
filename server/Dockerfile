FROM mhart/alpine-node:8

RUN apk update && apk upgrade && apk add --no-cache --update python make gcc g++

EXPOSE 3000

COPY . /app
WORKDIR /app

RUN npm install

CMD npm start
