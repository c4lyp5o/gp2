# base ubuntu
# FROM ubuntu:latest

# install nodejs
# RUN apt-get update && apt-get install -y curl
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
# RUN apt-get install -y nodejs

# install java
# RUN apt-get install -y openjdk-8-jre

# base node:18
# FROM node:18

# set Timezone to Malaysia
# RUN apt update && apt install tzdata -y
# ENV TZ=Asia/Kuala_Lumpur

# pull the Node.js Docker image
FROM node:alpine

# update the package index
RUN apk update
RUN apk add --no-cache tzdata

# set timezone data
ENV TZ=Asia/Kuala_Lumpur

# create app directory
WORKDIR /usr/src/app

# bundle app source
COPY . .

# install node_modules
RUN npm run install-server && npm run install-client

# build client React JS
RUN npm run build-client

# app run on port 5000
EXPOSE 5000

# run the server
CMD [ "node", "server.js" ]
