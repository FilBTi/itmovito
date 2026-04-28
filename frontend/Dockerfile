FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

COPY . .

EXPOSE 3030

CMD ["yarn", "webpack", "serve", "--mode", "development", "--host", "0.0.0.0", "--port", "3030"]
