FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Run the build command to create the dist folder
RUN npm run build

EXPOSE 8080

# Run the app in production mode
CMD ["node", "dist/main.js"]
