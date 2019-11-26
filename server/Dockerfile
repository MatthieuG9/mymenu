FROM node:12-alpine AS base
WORKDIR /app

FROM base AS builder
#RUN apk update && apk add -y git

WORKDIR /app
COPY package*.json ./
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force && npm config set unsafe-perm true

# add dependencies to build packages
RUN apk update && apk add python && \
    npm install -g node-gyp

# Storing node modules on a separate layer will prevent unnecessary npm installs at each build
# bcrypt have to rebuild or cause segmentation fault
# modclean have to occure after bcrypt build or build will break
RUN npm i --only=production && npm install modclean -g && \
    npm rebuild bcrypt --build-from-source && \
    modclean -P -e -r --patterns="default:safe,default:caution" && \
    mkdir prod && cp -R ./node_modules ./prod
RUN npm i && mkdir dev && cp -R ./node_modules ./dev

WORKDIR /app/dev
COPY . .

# build
RUN npm run compile


FROM base AS release

WORKDIR /app

#copy build result, nodes_modules and config files
COPY --from=builder /app/prod/node_modules ./src/node_modules
COPY --from=builder /app/dev/lib ./src
COPY config ./config

EXPOSE 3000
CMD node src/index.js
