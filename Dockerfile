FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY src /usr/share/nginx/html

ARG TODO_API_URL
ENV TODO_API_URL=$TODO_API_URL

RUN envsubst '$TODO_API_URL' < /usr/share/nginx/html/app.js > /usr/share/nginx/html/app.js