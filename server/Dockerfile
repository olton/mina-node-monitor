FROM node:14
RUN mkdir -p /home/minamon/server/node_modules && chown -R minamon:minamon /home/minamon/server
WORKDIR /home/minamon/server
COPY package*.json ./
USER minamon
ENTRYPOINT ["node", "index.js"]
RUN npm install
# RUN npm ci --only=production
COPY --chown=minamon:minamon . .
EXPOSE 8000
# CMD [ "node", "index.js" ]