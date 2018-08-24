FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Copy over the artifacts in src folder to default nginx public folder
COPY src /usr/share/nginx/html
