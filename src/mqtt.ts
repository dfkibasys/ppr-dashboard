import getEnv from '@/helpers/env'; //TODO: Get broker from store
import * as mqtt from 'mqtt';
import * as uuid from 'uuid';

let client: any = null;

export default {
  connect() {
    client = mqtt.connect(getEnv('VITE_MQTT_BROKER_URL'), { clientId: uuid.v4(), clean: true });

    client.on('connect', () => {
      console.log(`Connected to ${getEnv('VITE_MQTT_BROKER_URL')}`);
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
