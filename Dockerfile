FROM node:18-alpine

WORKDIR /app

# Copy root package.json
COPY package*.json ./

# Copy server and client
COPY server ./server
COPY client ./client

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Build client
RUN cd client && npm run build

# Expose ports
EXPOSE 5000 3000

# Start both server and client
CMD ["npm", "run", "dev"]
