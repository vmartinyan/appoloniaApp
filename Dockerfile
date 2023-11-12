FROM node:16.15.1
WORKDIR /app
#ADD package*.json ./
COPY package.json .
RUN npm install
#ADD index.js ./
COPY . ./
EXPOSE 8082
#CMD [ "node", "index.js" ]
CMD ["npm", "start"]