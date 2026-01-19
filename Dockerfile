FROM denoland/deno:latest

# Create app dir
WORKDIR /app

COPY deno.json* package.json* ./

# Install deps
RUN deno install

# Copy source
COPY . .

# cache entrypoint
RUN deno cache main.ts

# Expose ports
EXPOSE 3000 433

# Run Talking Stick
ENTRYPOINT ["deno"]
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "main.ts"]
