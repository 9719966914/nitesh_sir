const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');

// MQTT Broker and Topics
const brokerAddress = "tagcloud.minew.com";
const brokerPort = 2883;
const mqttTopics = [
    "/mg3/ac233fc179f8/status",
    "/gw/ac233fc18c39/status",
    "/gw/ac233fc18c3f/status"
];

// Beacon MAC addresses and gateways MAC addresses
const filterMacIds = ["C30000288FFB", "c30000288ffb", "C30000289002", "c30000289002", "C30000289003", "c30000289003", "C30000288FFC", "c30000288ffc"];
const filterGateways = ["ac233fc18c39", "ac233fc18c3f", "ac233fc179f8"];

// RSSI and Path Loss Constants
const rssiMeasured = -42;
const pathLossExponent = 2.6;

// Custom Kalman Filter for smoothing RSSI
class KalmanFilter {
    constructor(processVariance = 1e-3, measurementVariance = 1e-2, estimationError = 1.0, initialEstimate = 0.0) {
        this.processVariance = processVariance;
        this.measurementVariance = measurementVariance;
        this.estimationError = estimationError;
        this.currentEstimate = initialEstimate;
    }

    update(measurement) {
        const kalmanGain = this.estimationError / (this.estimationError + this.measurementVariance);
        this.currentEstimate += kalmanGain * (measurement - this.currentEstimate);
        this.estimationError = (1 - kalmanGain) * this.estimationError + this.processVariance;
        return this.currentEstimate;
    }
}

const rssiFilters = {
    "ac233fc12a12": new KalmanFilter(1e-3, 1e-2),
    "ac233fc18c39": new KalmanFilter(1e-3, 1e-2),
    "ac233fc18c3f": new KalmanFilter(1e-3, 1e-2),
    "ac233fc179f8": new KalmanFilter(1e-3, 1e-2)
};

// To store the last 10 distance samples for each MAC address
const distanceSamples = {};

// Variable to store the latest processed data
let latestProcessedData = [];

// Calculate distance using RSSI and round to two decimal places
function calculateDistance(meanRssi) {
    try {
        const distance = Math.pow(10, (rssiMeasured - meanRssi) / (10 * pathLossExponent));
        return parseFloat(distance.toFixed(2)); // Round to two decimal places
    } catch (error) {
        console.error(`Error calculating distance: ${error}`);
        return null;
    }
}

// Function to calculate mean of an array
function calculateMean(samples) {
    const sum = samples.reduce((a, b) => a + b, 0);
    return parseFloat((sum / samples.length).toFixed(2)); // Round to two decimal places
}

// MQTT Connection and Message Handling
const client = mqtt.connect(`mqtt://${brokerAddress}:${brokerPort}`);

client.on('connect', () => {
    console.log(`Connected to MQTT Broker! ${brokerAddress}`);
    mqttTopics.forEach(topic => client.subscribe(topic));
});

client.on('message', (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        const gateway = topic.split('/')[2];

        if (!filterGateways.includes(gateway)) return;

        if (Array.isArray(payload)) {
            payload.forEach(item => {
                if (typeof item === 'object' && filterMacIds.includes(item.mac)) {
                    const smoothedRssi = rssiFilters[gateway].update(item.rssi);
                    const distance = calculateDistance(item.rssi);

                    if (distance === null) return;

                    if (!distanceSamples[item.mac]) {
                        distanceSamples[item.mac] = [];
                    }

                    distanceSamples[item.mac].push(distance);

                    if (distanceSamples[item.mac].length > 10) {
                        distanceSamples[item.mac].shift(); // Remove the oldest sample
                    }

                    if (distanceSamples[item.mac].length === 10) {
                        const meanDistance = calculateMean(distanceSamples[item.mac]);

                        const filteredData = {
                            'gateway': gateway,
                            'tag-mac': item.mac,
                            'rssi': item.rssi,
                            'smoothed_rssi': smoothedRssi,
                            'distance': meanDistance
                        };

                        console.log(filteredData);

                        // Store the filtered data
                        latestProcessedData.push(filteredData);
                    }
                }
            });
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
});

// Express Server to expose data via an API
const app = express();
const port = 3002;
app.use(cors());

app.get('/api/data', (req, res) => {
    if (latestProcessedData.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.json({ data: latestProcessedData });
    } else {
        res.status(200).json({ data: 'No data processed yet' });
        console.log('Data not processed yet');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
