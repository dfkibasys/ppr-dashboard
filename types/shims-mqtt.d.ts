// see https://github.com/mqttjs/MQTT.js/issues/1269#issuecomment-841243295
declare module 'mqtt/dist/mqtt.min' {
  import MQTT from 'mqtt';
  export = MQTT;
}
