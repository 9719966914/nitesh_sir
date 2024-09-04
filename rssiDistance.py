import paho.mqtt.client as mqtt
import time
import json




# MQTT Broker and Topics
broker_address = "tagcloud.minew.com"
broker_port = 2883
mqtt_topics = [
    "/mg3/ac233fc179f8/status",
#     "/mg4/ac233fc12a12/status",
    "/gw/ac233fc18c39/status",
    "/gw/ac233fc18c3f/status"
    
]

# local mqtt

broker_address_local = "103.127.30.171"
broker_local_port = 1883
local_mqtt_topic = "IN-OUT_data"


# Beacon mac-address and gateways mac-address 

# filter_mac_id = "c300002613d1"
# filter_mac_id2 = "C300002613D1"
# filter_mac_ids = [ "C30000212BE0", "c30000212be0","c3000026139a", "C3000026139A"]
# filter_mac_ids = ["c30000218b1b", "C30000218B1B"]
filter_mac_ids = ["C30000289002", "c30000289002","C30000288FFE","c30000288ffe","C30000288FFB","c30000288ffb","C30000289003","c30000289003","C30000288FFC","c30000288ffc","c30000218b1b", "C30000218B1B"]
filter_gateways = ["ac233fc18c39", "ac233fc18c3f", "ac233fc179f8", "ac233fc12a12"]


distance_samples = {
    
    "ac233fc12a12": [],
    "ac233fc18c39": [],
    "ac233fc18c3f": [],
    "ac233fc179f8": []
}


#pre measure position of gateways

# gateway_positions = {
#     "ac233fc12a12": (5.6, 7),
#     "ac233fc18c39": (0, 0),
#     "ac233fc18c3f": (10.1, -0.81)
# }

rssi_measured = -33
path_loss_exponent = 2.7

# kalman filter  used for smooth rssi

class KalmanFilter:
    def __init__(self, process_variance=1e-3, measurement_variance=1e-2, estimation_error=1.0, initial_estimate=0.0):
        self.process_variance = process_variance
        self.measurement_variance = measurement_variance
        self.estimation_error = estimation_error
        self.current_estimate = initial_estimate

    def update(self, measurement):
        kalman_gain = self.estimation_error / (self.estimation_error + self.measurement_variance)
        self.current_estimate += kalman_gain * (measurement - self.current_estimate)
        self.estimation_error = (1 - kalman_gain) * self.estimation_error + self.process_variance
        return self.current_estimate


# distance calculation using rssi

def calculate_distance(mean_rssi):
    try:
        distance = 10 ** ((rssi_measured - mean_rssi) / (10 * path_loss_exponent))
        return distance
    except Exception as e:
        print(f"Error calculating distance: {e}")
        return None


#apply triangulate position logic to find position of the beacon

# def triangulate_position(distances):
#     try:
#         (x1, y1), (x2, y2), (x3, y3) = gateway_positions.values()
#         d1, d2, d3 = distances.values()
# 
#         a = (-2 * x1) + (2 * x2)
#         b = (-2 * y1) + (2 * y2)
#         c = (d1**2) - (d2**2) - (x1**2) + (x2**2) - (y1**2) + (y2**2)
#         d = (-2 * x2) + (2 * x3)
#         e = (-2 * y2) + (2 * y3)
#         f = (d2**2) - (d3**2) - (x2**2) + (x3**2) - (y2**2) + (y3**2)
# 
#         x = (c * e - f * b) / (e * a - b * d)
#         y = (c * d - a * f) / (b * d - a * e)
# 
#         return x, y
#     except Exception as e:
#         logging.error(f"Error in triangulation: {e}")
#         return None, None

# taking mean of positions

# def calculate_mean_position(positions):
#     try:
#         mean_x = sum(pos[0] for pos in positions) / len(positions)
#         mean_y = sum(pos[1] for pos in positions) / len(positions)
#         return mean_x, mean_y
#     except Exception as e:
#         logging.error(f"Error calculating mean position: {e}")
#         return None, None

# List to store triangulated positions
position_samples = []

# mqtt connections 

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!", broker_address)
        for topic in mqtt_topics:
            client.subscribe(topic)
    else:
        print(f"Failed to connect, return code {rc}")
        
def on_connect_local(local_client, userdata, flags, rc):
    if rc == 0:
        print("Connected to Local MQTT Broker!", broker_address_local)
    else:
        print(f"Failed to connect, return code {rc}\n")

def on_message(client, userdata, message):
    try:
        payload = message.payload.decode()
        data = json.loads(payload)
        gateway = message.topic.split('/')[2]
        print(gateway)

        if gateway not in filter_gateways:
            return

        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and item.get('mac') in filter_mac_ids :
                    
                    smoothed_rssi = rssi_filters[gateway].update(item.get('rssi'))
                    distance = calculate_distance(item.get('rssi'))

                    if distance is None:
                        continue

#                     distance_samples[gateway].append(distance)

                    # Ensure all three gateways have received RSSI
#                     if all(len(distances) > 0 for distances in distance_samples.values()):
#                         current_distances = {gw: distances[-1] for gw, distances in distance_samples.items()}
#                         position = triangulate_position(current_distances)
# 
#                         if position and all(position):
#                             position_samples.append(position)
# 
#                             # If we have 10 positions, calculate the mean position
#                             if len(position_samples) == 10:
#                                 mean_position = calculate_mean_position(position_samples)
#                                 if mean_position and all(mean_position):
#                                     logging.info(f"Mean Position -> x: {mean_position[0]} y: {mean_position[1]}")
#                                 position_samples.clear()
# 
#                         for gw in distance_samples:
#                             distance_samples[gw].clear()

                    filtered_data = {
                        'gateway': gateway,
                        'tag-mac': item.get('mac'),
#                         'timestamp': item.get('timestamp'),
                        'rssi': item.get('rssi'),
                        'smoothed_rssi': smoothed_rssi,
                        
                        'distance':distance
                        
                    }
                    print(filtered_data)
                    local_client.publish(local_mqtt_topic, json.dumps(filtered_data))
                    

    except json.JSONDecodeError:
        print("Failed to decode JSON message")
    except Exception as e:
        print(f"An error occurred: {e}")

    time.sleep(0.1)

rssi_filters = {
    "ac233fc12a12": KalmanFilter(process_variance=1e-3, measurement_variance=1e-2),
    "ac233fc18c39": KalmanFilter(process_variance=1e-3, measurement_variance=1e-2),
    "ac233fc18c3f": KalmanFilter(process_variance=1e-3, measurement_variance=1e-2),
    "ac233fc179f8": KalmanFilter(process_variance=1e-3, measurement_variance=1e-2),    
}

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(broker_address, broker_port, 60)

local_client = mqtt.Client()
local_client.on_connect = on_connect_local
local_client.connect(broker_address_local, broker_local_port, 60)

client.loop_forever()