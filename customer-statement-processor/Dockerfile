# --platform=linux/amd64 is needed to run docker image in fargate
FROM --platform=linux/amd64 node:21-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
copy ./.env ./
COPY ./build.sh ./
COPY ./. .


EXPOSE 8000

RUN ["chmod", "+x", "./build.sh"]

CMD ["node", "/app/build/src/index.js"]
