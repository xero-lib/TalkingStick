FROM oven/bun:1.3-slim
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "src/main.ts"]