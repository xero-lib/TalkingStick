FROM denoland/deno:latest

# Create app dir
WORKDIR /app

COPY deno.json* package.json* ./

# Install deps
RUN deno install

# Copy source
COPY . .

# cache entrypoint
RUN deno cache --sloppy-imports index.ts

# Expose ports
EXPOSE 3000 433

# Run Talking Stick
ENTRYPOINT ["deno"]
CMD ["run", "--allow-net", "--allow-env", "--sloppy-imports", "--unstable-node-globals", "--allow-read", "--allow-sys", "index.ts"]
