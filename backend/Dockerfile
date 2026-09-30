# Use official lightweight Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set container user to built-in non-privileged "node" user for security
USER node

# Expose backend API port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]
