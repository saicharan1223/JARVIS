FROM node:20-alpine

# set working directory
WORKDIR /app

# Install dependencies (including dev deps so we can run TypeScript at runtime with tsx)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --silent

# Copy project files
COPY . .

# Build the frontend (Vite)
RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start the server (uses tsx to run server.ts)
CMD ["npx", "tsx", "server.ts"]
