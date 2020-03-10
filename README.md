# ppr-dashboard

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Docker
Set the needed BaSys/MQTT/Camunda URLS in .env file

```
VUE_APP_BASYS_REST_URL=http://10.2.10.3:8080
VUE_APP_MQTT_BROKER_URL=ws://10.2.10.1:8083/mqtt
VUE_APP_CAMUNDA_REST_URL=http://10.2.10.4:8080
```

Run docker script

```
./docker.sh
```