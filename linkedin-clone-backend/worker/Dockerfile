FROM node

WORKDIR /app/worker

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]