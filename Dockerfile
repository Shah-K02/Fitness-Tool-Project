# Production image: builds the React client, then runs the Express API,
# which serves the built client on the same origin.
#   docker build -t fitness-assistant .
#   docker run -p 8081:8081 --env-file server/server/.env -e NODE_ENV=production fitness-assistant

# --- Build the client ---
FROM node:20-alpine AS client
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# --- Runtime ---
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app/server/server
COPY server/server/package.json server/server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server/server/ ./
# schema.sql, applied at startup to create any missing tables.
COPY server/db/ /app/server/db/
COPY --from=client /app/client/build /app/client/build
# Uploaded images live here; mount a volume at this path to keep them
# across deploys.
RUN mkdir -p uploads && chown -R node:node uploads
USER node
EXPOSE 8081
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:${PORT:-8081}/api/health || exit 1
CMD ["node", "server.js"]
