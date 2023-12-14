#!/bin/sh
set -eu

# Set NGINX_PROXY to an empty string if not set
NGINX_PROXY="${NGINX_PROXY:-}"

# Use sed to replace the placeholder in the template / remove the line if NGINX_PROXY is not set
if [ -n "$NGINX_PROXY" ]; then
  sed -e "s|proxy_pass \${NGINX_PROXY};|proxy_pass $NGINX_PROXY;|g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
else
  sed -e "/proxy_pass \${NGINX_PROXY};/d" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
fi

echo "NGINX_PROXY is set to: $NGINX_PROXY"

JSON_STRING='window.configs = { \
  "VITE_MQTT_BROKER_URL":"'"${VITE_MQTT_BROKER_URL}"'", \
  "VITE_CAMUNDA_REST_URL":"'"${VITE_CAMUNDA_REST_URL}"'", \
  "VITE_AAS_REGISTRY_URL":"'"${VITE_AAS_REGISTRY_URL}"'", \
  "VITE_AJAX_REQUEST_DOMAIN":"'"${VITE_AJAX_REQUEST_DOMAIN}"'", \
  "VITE_ENABLE_BASYSAFE_INTEGRATION":"'"${VITE_ENABLE_BASYSAFE_INTEGRATION}"'" \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html

exec "$@"