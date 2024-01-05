# Build Stage 1
FROM node:20.3-alpine3.18 AS base

WORKDIR /usr/src/app

COPY package.json .

COPY package-lock.json .

RUN npm install

# docker build . --file Dockerfile --target test
# FROM base AS test

# COPY . .

# RUN npm run test:ci

# Build Stage 2 builder
FROM base AS builder

COPY . .

RUN npm run build

# Build Stage 3 prod
FROM node:20.3-alpine3.18 AS prod-stage

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

RUN apk upgrade --no-cache --update && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates && \
    rm -rf /var/cache/apk/*

COPY --chown=node:node package.json .

COPY --chown=node:node package-lock.json .

COPY --chown=node:node healthcheck.js .

COPY --chown=node:node db ./db

RUN npm install --omit=dev

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

EXPOSE 3050

USER node

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \  
    CMD node healthcheck.js
    

CMD [ "node" , "dist/index.js"]
