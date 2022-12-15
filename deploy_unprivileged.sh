#!/bin/sh

echo "#################################################################"
echo "# Deploying html files "
cp --recursive --force /var/lib/ppr-dashboard/html /usr/share/nginx
ls -la /usr/share/nginx/html
echo "#################################################################"
echo ""
echo "#################################################################"
echo "# Injecting Environment variables "

set -eu
# envsubst '${NGINX_PROXY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

JSON_STRING='window.configs = { \
  "VUE_APP_MQTT_BROKER_URL":"'"${VUE_APP_MQTT_BROKER_URL}"'", \
  "VUE_APP_CAMUNDA_REST_URL":"'"${VUE_APP_CAMUNDA_REST_URL}"'", \
  "VUE_APP_AAS_REGISTRY_URL":"'"${VUE_APP_AAS_REGISTRY_URL}"'", \
  "VUE_APP_AJAX_REQUEST_DOMAIN":"'"${VUE_APP_AJAX_REQUEST_DOMAIN}"'" \
}'
echo JSON_STRING

sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
