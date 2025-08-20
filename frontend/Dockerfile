FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
