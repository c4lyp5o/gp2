# pull the Node.js Docker image
FROM node:lts-alpine

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
CMD ["npm", "start"]
