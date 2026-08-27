FROM node:20-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production

COPY . ./

ENV PYTHON=python3
EXPOSE 3000
CMD ["npm", "start"]
