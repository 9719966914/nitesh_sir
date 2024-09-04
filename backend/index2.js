const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const port = 3002;
app.use(cors());

const brokerUrl = 'mqtt://103.127.30.171:1883';
const topic = 'Beacon_Data';

const client = mqtt.connect(brokerUrl);

let latestData = null;

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error('Failed to subscribe:', err);
        }
    });
});

client.on('message', (topic, message) => {
    latestData = message.toString();
    console.log('Received message:', latestData);
});

app.get('/api/data', (req, res) => {
    if (latestData) {
        try {
            const parsedData = JSON.parse(latestData);
            res.setHeader('Content-Type', 'application/json');
            res.json({ data: parsedData });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Invalid JSON data' });
        }
    } else {
        res.status(200).json({ data: 'No data received yet' });
        console.log('data not coming');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
