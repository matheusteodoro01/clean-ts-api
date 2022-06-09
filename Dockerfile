FROM node:16
WORKDIR /usr/app
COPY ./package.json /usr/app/package.json
RUN npm install --only=prod
