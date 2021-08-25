FROM node:14-alpine
MAINTAINER olton "serhii@pimenov.com.ua"
WORKDIR /minamon
COPY package*.json ./
RUN mkdir output
RUN npm install
COPY . .
EXPOSE 2222
ENTRYPOINT ["node", "start.js"]