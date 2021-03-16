#!/usr/bin/env sh
set -eu

envsubst '${VUE_APP_AJAX_REQUEST_DOMAIN}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"