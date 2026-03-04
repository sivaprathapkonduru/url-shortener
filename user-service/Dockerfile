# Use Node 20 LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of project
COPY . .

# Build project
RUN npm run build

# Start production
CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]