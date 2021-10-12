FROM node:lts as dependencies
WORKDIR /star-wars-client
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

FROM node:lts as builder
WORKDIR /star-wars-client
COPY . .
COPY --from=dependencies /star-wars-client/node_modules ./node_modules
RUN npm build

FROM node:lts as runner
WORKDIR /star-wars-client
ENV NODE_ENV production

COPY --from=builder /star-wars-client/public ./public
COPY --from=builder /star-wars-client/.next ./.next
COPY --from=builder /star-wars-client/node_modules ./node_modules
COPY --from=builder /star-wars-client/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
