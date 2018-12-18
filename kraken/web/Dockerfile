FROM envoyproxy/envoy-alpine:latest

RUN apk update && apk add nginx \
    && mkdir -p /run/nginx

ADD ./start_service.sh /usr/local/bin/start_service.sh
RUN chmod u+x /usr/local/bin/start_service.sh
ENTRYPOINT /usr/local/bin/start_service.sh