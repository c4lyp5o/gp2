# base nodejs v18
FROM node:18

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
EXPOSE 5001

# run the server
CMD [ "node", "server.js" ]
