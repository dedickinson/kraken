#!/bin/sh
nginx -g "daemon off;" &
envoy -c /etc/service-envoy.yaml --service-cluster service_${SERVICE_NAME}