FROM node:22-alpine

# Install Python and build dependencies including Linux headers
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    linux-headers \
    udev \
    eudev-dev

# Set working directory
WORKDIR /app

# # Copy package files first for better layer caching
# COPY package.json yarn.lock ./

# Copy all other files
COPY ./rome-deposit-ui .

# Install Node dependencies
RUN yarn install

# RUN yarn build
# # Copy all other files
# COPY ./rome-deposit-ui .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application in dev mode
# CMD ["npm", "run", "dev"]
CMD sh -c "npm run dev"