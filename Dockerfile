# Step 1: Use the official Node.js image from Docker Hub
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application files to the container
COPY . .

# Step 6: Expose the port your app will run on
EXPOSE 3000

# Step 7: Define the command to start the app
CMD ["npm", "start"]