const mqtt = require('mqtt');

// MQTT Broker and Topics
const brokerAddress = "tagcloud.minew.com";
const brokerPort = 2883;
const mqttTopics = [
    "/mg3/ac233fc179f8/status",
    "/gw/ac233fc18c39/status",
    "/gw/ac233fc18c3f/status"
];

// Local MQTT
const brokerAddressLocal = "103.127.30.171";
const brokerLocalPort = 1883;
const localMqttTopic = "Beacon_Data";

// Beacon MAC addresses and gateways MAC addresses
// const filterMacIds = ["c30000218b1b", "C30000218B1B"];
const filterMacIds = ["C30000288FFB", "c30000288ffb", "C30000289002", "c30000289002", "C30000289003", "c30000289003", "C30000288FFC", "c30000288ffc","c30000218b1b", "C30000218B1B"];
// const filterGateways = ["ac233fc18c39"];
const filterGateways = ["ac233fc18c39", "ac233fc18c3f", "ac233fc179f8"];

// RSSI and Path Loss Constants
const rssiMeasured = -43;
const pathLossExponent = 5.5;

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

// To store last 10 distance samples for each MAC address
const distanceSamples = {};

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
const localClient = mqtt.connect(`mqtt://${brokerAddressLocal}:${brokerLocalPort}`);

client.on('connect', () => {
    console.log(`Connected to MQTT Broker! ${brokerAddress}`);
    mqttTopics.forEach(topic => client.subscribe(topic));
});

localClient.on('connect', () => {
    console.log(`Connected to Local MQTT Broker! ${brokerAddressLocal}`);
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

                    // Calculate mean distance when we have at least 10 samples
                    if (distanceSamples[item.mac].length === 10) {
                        const meanDistance = calculateMean(distanceSamples[item.mac]);

                        const filteredData = {
                            'gateway': gateway,
                            'tag-mac': item.mac,
                            'rssi': item.rssi,
                            'timestamp':item.timestamp,
                            'smoothed_rssi': smoothedRssi,
                            'distance': meanDistance
                        };

                        console.log(filteredData);
                        localClient.publish(localMqttTopic, JSON.stringify(filteredData));
                    }
                }
            });
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
});
