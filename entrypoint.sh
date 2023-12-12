#!/bin/sh
set -eu

# Set NGINX_PROXY to a default value if not set
export NGINX_PROXY="${NGINX_PROXY:-http://localhost}"

envsubst '${NGINX_PROXY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "NGINX_PROXY is set to: $NGINX_PROXY"

JSON_STRING='window.configs = { \
  "VITE_MQTT_BROKER_URL":"'"${VITE_MQTT_BROKER_URL}"'", \
  "VITE_CAMUNDA_REST_URL":"'"${VITE_CAMUNDA_REST_URL}"'", \
  "VITE_AAS_REGISTRY_URL":"'"${VITE_AAS_REGISTRY_URL}"'", \
  "VITE_AJAX_REQUEST_DOMAIN":"'"${VITE_AJAX_REQUEST_DOMAIN}"'" \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html

exec "$@"