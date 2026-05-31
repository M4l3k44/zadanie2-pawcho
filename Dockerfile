# syntax=docker/dockerfile:1.7

FROM node:26-alpine

LABEL org.opencontainers.image.authors="Jakub Małek" \
      org.opencontainers.image.title="WeatherApp" \
      org.opencontainers.image.description="Prosta aplikacja pogodowa" \
      org.opencontainers.image.version="1.0.0"

ENV PORT=8080 \
    NODE_ENV=production \
    AUTHOR="Jakub Małek"

WORKDIR /app

COPY server.js package.json ./

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/healthz', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]