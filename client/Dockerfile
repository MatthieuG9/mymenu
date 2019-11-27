FROM node:12-alpine AS base
WORKDIR /app

FROM base AS builder
#prod or staging
ARG ANGULAR_ENV
RUN apk add --update git && rm -rf /tmp/* /var/cache/apk/*
COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force && npm config set unsafe-perm true

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir dev && cp -R ./node_modules ./dev

WORKDIR /app/dev

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng build --prod --configuration=$ANGULAR_ENV

FROM base AS release
WORKDIR /app

RUN npm config set unsafe-perm true

# Install app dependencies
RUN npm -g install buffet

COPY --from=builder /app/dev/dist /app

EXPOSE 8080
# serve app folder on port 8080
CMD ["buffet", "--notFoundPath", "index.html","--no-log","--no-watch"]
