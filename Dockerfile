FROM oven/bun

WORKDIR /app

COPY . .

RUN bun i

EXPOSE 5100

CMD ["bun", "run", "serve"]
