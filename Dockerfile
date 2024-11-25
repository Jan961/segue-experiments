ARG NODE_VERSION='18.20.4'
ARG CHROME_VERSION='130.0.6723.69-1'

FROM cypress/factory
RUN apt-get update
RUN apt-get install -y libreoffice
RUN apt-get install -y openssl

# Set working directory
WORKDIR /usr/app
RUN npm install cypress --save-dev
RUN npx cypress install

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
#COPY ./package*.json ./
#
## Install dependencies
#RUN npm install --production
#
## Copy all files
#COPY ./ ./
#
##RUN npm i prisma
##RUN prisma generate
## Build app
#RUN npm run build
#
## Expose the listening port
#EXPOSE 3000
#
## Run container as non-root (unprivileged) user
## The node user is provided in the Node.js Alpine base image
#USER node
#
## Run npm start script with PM2 when container starts
#CMD [ "pm2-runtime", "npm", "--", "start" ]