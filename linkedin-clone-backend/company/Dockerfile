FROM node

WORKDIR /app/company

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]