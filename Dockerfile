FROM oven/bun:latest

# Create app dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install deps
COPY package.json /usr/src/app/
RUN bun install

# Bundle remaining src
COPY . /usr/src/app/

EXPOSE 3000
CMD ["bun", "start"]