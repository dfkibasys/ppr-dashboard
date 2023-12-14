# PPR-Dashboard

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

## Docker

Set the needed Registry/MQTT/Camunda URLS in `.env` file

```
VITE_AAS_REGISTRY_URL=http://10.2.10.4:8020
VITE_MQTT_BROKER_URL=ws://10.2.10.1:8083/mqtt
VITE_CAMUNDA_REST_URL=http://10.2.10.4:8080
VITE_ENABLE_BASYSAFE_INTEGRATION=false
```

Build and start container

```
docker-compose up -d
```

Rebuild container after changes

```
docker-compose build
docker-compose up -d
```

## Circumventing CORS error

The same-origin policy of the browser protects web applications to interact only with apps of the same origin (protocol, domain, port). CORS allows cross-origin requests by setting specific headers for requests. Since the Camunda REST interface doesn't have CORS enabled and is running under another domain than the Vue application, two methods to circumvent those restrictions in development and production have been implemented.

### Development

In `vite.config.js` a proxy has been defined for the development server:

```
proxy: {
    '^/engine-rest': env.VITE_CAMUNDA_REST_URL,
},
```

All AJAX requests will be sent to the local address of the VueJS application, which is defined in the `.env` file:

```
VITE_AJAX_REQUEST_DOMAIN=http://localhost:3000/engine-rest
```

Source: https://medium.com/js-dojo/how-to-deal-with-cors-error-on-vue-cli-3-d78c024ce8d3

### Production (Docker)

Since the Docker production version uses nginx, relevant headers have been set and the server has been configured as proxy in `default.conf`:

```
location /engine-rest/
{
    proxy_pass ${NGINX_PROXY};
}
```

The AJAX request domain needs to be adapted to the public domain of the VueJS application:

```
VITE_AJAX_REQUEST_DOMAIN=http://hybrit-lnv-1:8090/engine-rest
```

Source: https://medium.com/pareture/simple-docker-nginx-cors-reverse-proxy-5202a3445847
