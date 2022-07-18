FROM node:16-alpine

# Alpine node image doesn't come with bash
RUN apk --no-cache add \
    curl \
    bash \
    make \ 
    python3

RUN mkdir -p /app
RUN mkdir -p /app/lib

WORKDIR /app

# install and cache app dependencies
COPY package*.json ./
RUN npm i

COPY . /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ENV PORT 3000

EXPOSE 3000

CMD [ "npm", "run", "build:dev" ] 