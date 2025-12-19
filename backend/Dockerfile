# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy app
COPY . .

# Expose port and run
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
