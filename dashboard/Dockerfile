FROM node:23-alpine3.19

WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn install && yarn upgrade

# Install xdg-utils
RUN apk add --no-cache xdg-utils

COPY . .

# Remove rm -rf .env

EXPOSE 3000

CMD ["yarn", "start", "--host", "0.0.0.0"]