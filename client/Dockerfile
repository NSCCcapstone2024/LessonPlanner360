# pull basic node image from docker hub (alpine is a scaled down image for size)
# this image includes node and npm ready to use (need to use no later version than 16 for nextjs SSR / SSG fetches to work)
FROM node:16-alpine3.16
# Working directory be app
WORKDIR /usr/app/client
COPY package*.json ./
# Install dependencies
RUN npm install
# copy local files to app folder
COPY . .
EXPOSE 3000
CMD ["npm","run","dev"]