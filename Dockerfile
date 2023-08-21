# pull the Node.js Docker image
FROM node:lts-alpine

# update the package index
RUN apk update && apk add --no-cache tzdata

# set timezone data
ENV TZ=Asia/Kuala_Lumpur

# create app directory
WORKDIR /usr/src/app

# bundle app source
COPY . .

# install node_modules, build client React JS, prune image for production
RUN npm run install-prod && npm run build-client && npm run prune-prod

# delete unnecessary folder
RUN rm -rf client/node_modules && rm -rf unrelated-references

# app run on port 5000
EXPOSE 5000

# run the server
CMD ["npm", "start"]
