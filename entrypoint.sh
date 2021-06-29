#!/bin/sh
set -eu

envsubst '${NGINX_PROXY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

JSON_STRING='window.configs = { \
  "VUE_APP_BASYS_REST_URL":"'"${VUE_APP_BASYS_REST_URL}"'", \
  "VUE_APP_MQTT_BROKER_URL":"'"${VUE_APP_MQTT_BROKER_URL}"'", \
  "VUE_APP_CAMUNDA_REST_URL":"'"${VUE_APP_CAMUNDA_REST_URL}"'", \
  "VUE_APP_AAS_REGISTRY_URL":"'"${VUE_APP_AAS_REGISTRY_URL}"'", \
  "VUE_APP_AJAX_REQUEST_DOMAIN":"'"${VUE_APP_AJAX_REQUEST_DOMAIN}"'" \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html

exec "$@"