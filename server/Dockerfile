FROM node:14-alpine
MAINTAINER olton "serhii@pimenov.com.ua"
ENV NODE_ENV=production
WORKDIR /minamon
COPY package*.json ./
RUN npm install --production
COPY . .
COPY config.example.json config.json
EXPOSE 8000
ENTRYPOINT ["node", "index.js"]
# CMD [ "node", "index.js" ]