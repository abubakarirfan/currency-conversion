# Use official Node.js LTS image
FROM node:18-alpine

WORKDIR /app

# Accept build arguments for API key and base URL
ARG NEXT_PUBLIC_OPENEXCHANGE_API_KEY
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_OPENEXCHANGE_API_KEY=$NEXT_PUBLIC_OPENEXCHANGE_API_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]