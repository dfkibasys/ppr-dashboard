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

JSON_STRING='window.configs = { \
  "VITE_MQTT_BROKER_URL":"'"${VITE_MQTT_BROKER_URL}"'", \
  "VITE_CAMUNDA_REST_URL":"'"${VITE_CAMUNDA_REST_URL}"'", \
  "VITE_AAS_REGISTRY_URL":"'"${VITE_AAS_REGISTRY_URL}"'", \
  "VITE_AJAX_REQUEST_DOMAIN":"'"${VITE_AJAX_REQUEST_DOMAIN}"'", \
  "VITE_ENABLE_BASYSAFE_INTEGRATION":"'"${VITE_ENABLE_BASYSAFE_INTEGRATION}"'" \
}'
echo JSON_STRING

sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
