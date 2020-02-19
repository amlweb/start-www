FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]


#$ docker run \
#  -e "NODE_ENV=production" \
#  -u "node" \
#  -m "300M" --memory-swap "1G" \
#  -w "/home/node/app" \
#  -p 3001:3000
#  --name "my-nodejs-app" \
#  node [script]