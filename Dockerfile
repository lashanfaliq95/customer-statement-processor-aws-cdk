FROM --platform=linux/amd64 node:21-alpine
WORKDIR /app
COPY ./customer-statement-processor/package.json ./
COPY ./customer-statement-processor/package-lock.json ./
COPY ./customer-statement-processor/tsconfig.json ./
copy ./customer-statement-processor/test.env ./
COPY ./customer-statement-processor/build.sh ./
COPY ./customer-statement-processor/. .

RUN ["chmod", "+x", "./build.sh"]
CMD ["node", "/app/build/src/index.js"]
EXPOSE 8000
