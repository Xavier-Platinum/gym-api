# server/Dockerfile
# Step 1: Use official Node.js image as base
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the NestJS application
RUN npm run build

# Step 7: Expose the backend port (default for NestJS is 3000)
EXPOSE 3001

# Step 8: Start the application
CMD ["npm", "run", "start:prod"]