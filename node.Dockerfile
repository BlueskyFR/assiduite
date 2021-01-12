FROM node:lts-alpine

ADD creds /
RUN chmod 444 /creds
WORKDIR /api