FROM oven/bun

WORKDIR /app

COPY . .

CMD [ "bun", "i" ]
