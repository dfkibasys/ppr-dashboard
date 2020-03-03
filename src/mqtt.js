import store from "./store";

let mqtt = require('mqtt'),
    uuid = require('uuid'),
    client = {};

export default {
    connect() {
        client = mqtt.connect(store.getters.mqttUrl, {clientId: uuid.v4(), clean: true});

        client.on('connect', function () {
            console.log("Connected to " + store.getters.mqttUrl);
        })
    },
    on(callback) {
        client.on('message', (topic, message) => {
            callback(topic, message)
        })
    },
    end() {
        client.end()
    },
    subscribe(topic) {
        client.subscribe(topic, function (err) {
            if (!err) {
                console.log('Subscribed to topic', topic);
            }
        });
    },
    publish(topic, message) {
        client.publish(topic, JSON.stringify(message), {qos: 1})
    }
}

