import * as mqtt from 'mqtt';
import * as uuid from 'uuid';
import store from '@/main';

let client: any = null;

export default {
  connect() {
    client = mqtt.connect(store.getters['endpoints/mqttUrl'], { clientId: uuid.v4(), clean: true });

    client.on('connect', function () {
      console.log(`Connected to ${store.getters['endpoints/mqttUrl']}`);
    });
  },
  on(callback: any) {
    if (client !== undefined && client !== null) {
      client.on('message', (topic: string, message: string) => {
        callback(topic, message);
      });
    }
  },
  end() {
    if (client !== undefined && client !== null) {
      client.end();
    }
  },
  subscribe(topic: string) {
    if (client !== undefined && client !== null) {
      client.subscribe(topic, function (err: Error) {
        if (!err) {
          console.log(`Subscribed to topic ${topic}`);
        }
      });
    }
  },
  publish(topic: string, message: string) {
    if (client !== undefined && client !== null) {
      client.publish(topic, JSON.stringify(message), { qos: 1 });
    }
  },
};
