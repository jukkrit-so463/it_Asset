# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN apk add --no-cache python3 make g++
RUN npm install

# Copy the rest of the application code
COPY . .
RUN chmod +x /app/wait-for-it.sh # <--- เพิ่มบรรทัดนี้

# Generate Prisma Client
RUN npx prisma generate

# Make port 3000 available to the world outside this container
EXPOSE 5000

# Run the app when the container launches
CMD ["/app/wait-for-it.sh", "db:3306", "--", "node", "index.js"]