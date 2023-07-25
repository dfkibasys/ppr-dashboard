import store from '@/store/index';
import * as mqtt from 'mqtt/dist/mqtt.min';
import * as uuid from 'uuid';

let client;

export default {
  connect() {
    client = mqtt.connect(store.getters['endpoints/mqttUrl'], { clientId: uuid.v4(), clean: true });

    client.on('connect', function () {
      console.log(`Connected to ${store.getters['endpoints/mqttUrl']}`);
    });
  },
  on(callback: any) {
    client.on('message', (topic: string, message: string) => {
      callback(topic, message);
    });
  },
  end() {
    client.end();
  },
  subscribe(topic: string) {
    client.subscribe(topic, function (err: Error) {
      if (!err) {
        console.log(`Subscribed to topic ${topic}`);
      }
    });
  },
  publish(topic: string, message: string) {
    client.publish(topic, JSON.stringify(message), { qos: 1 });
  },
};
