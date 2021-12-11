FROM node:14.15.0-alpine

# set working directory
WORKDIR /client

# install app dependencies
COPY package*.json ./

RUN yarn install

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["yarn", "start"]
