FROM node:16-alpine3.15

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && npm prune --production

ENV TS_NODE_BASEURL "./dist"
CMD ["node", "-r", "tsconfig-paths/register", "dist/index.js"]
