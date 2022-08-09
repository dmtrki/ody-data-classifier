ARG NODE_ENV=production
FROM node:18-alpine AS builder
WORKDIR /builder
ENV NODE_ENV $NODE_ENV
COPY package.json yarn.lock ./
RUN yarn --only=$NODE_ENV
COPY . ./

FROM builder AS production-build
WORKDIR /var/www/api
COPY --from=builder ./builder ./
ENV PATH /var/www/api/node_modules/.bin:$PATH
RUN yarn add prisma && npm install -g @nestjs/cli && npx prisma generate
RUN yarn build

FROM builder AS development-build
WORKDIR /var/www/api
COPY --from=builder ./builder ./
ENV PATH /var/www/api/node_modules/.bin:$PATH
RUN yarn add -D prisma && npm install -g @nestjs/cli && npx prisma generate