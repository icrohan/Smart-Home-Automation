# Smart-Home-Automation
Home automation system using IoT, MQTT, React.js, and Node.js involves several steps, including setting up the hardware, backend, and frontend.
![WhatsApp Image 2025-02-03 at 12 06 48_904bd4ae](https://github.com/user-attachments/assets/61462919-4152-4792-94a5-4dd95a7c63bf)


Here's a detailed description of how you can build such a system:

*1. Hardware Setup*
Components:
Microcontroller: ESP32/ESP8266
Sensors: Temperature, humidity, motion, etc.
Actuators: Relays for controlling lights, fans, etc.
WiFi Network: To connect your devices to the internet.
![WhatsApp Image 2025-02-03 at 11 26 38_a62c4982](https://github.com/user-attachments/assets/0d70401d-a153-44f6-82a5-8acb54f00caa)



*2. MQTT Broker*
MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol for small sensors and mobile devices.
Setup:
Install an MQTT broker such as Mosquitto on a server or a Raspberry Pi.
sh
Copy code
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients
Configure Mosquitto by editing the configuration file (/etc/mosquitto/mosquitto.conf) to allow remote connections and set up authentication if needed.
![WhatsApp Image 2025-02-03 at 11 26 39_863bbc54](https://github.com/user-attachments/assets/e283f0c7-1657-40c9-9ab2-171617eb1f24)

![WhatsApp Image 2025-02-03 at 11 26 38_f50d4519](https://github.com/user-attachments/assets/19cc0187-aecc-49e7-93b3-c3f0c403c071)



*3. Backend:*
Node.js Server
A Node.js server to handle communication between the frontend and the MQTT broker.
