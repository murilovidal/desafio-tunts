FROM node:15.11.0-stretch-slim

COPY . /teste-tunts/

WORKDIR /teste-tunts

RUN npm install

CMD ["npm","start"]