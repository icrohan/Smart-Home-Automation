const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

const app = express();
const port = 3001;

const mqttTopics = ['bme680/p1', 'bme680/p2', 'bm680/p3', 'bme680/p4', 'bme680/p5'];
const mqttTopics1 = ['health/t1', 'health/t2', 'health/t3', 'health/t4'];
const watertopics = ['water/a1'];
const planttopics = ['plant/b1', 'plant/b2']



app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let buttonState = "off";
let fanState = "low";
let motorState = "down";
let lightState = "zero";
let sensorData = {
  sensor1: '',
  sensor2: '',
  sensor3: '',
  sensor4: '',
  sensor5: ''
};
let healthData ={
  value1: '',
  value2: '',
  value3: '',
  value4: ''
}
let waterData = {
  water1: ''
}
let plantData = {
  plant1: '',
  plant2: ''
}
const mqttClient = mqtt.connect('mqtt:// 127.0.0.1:1883');

mqttClient.on('connect', function () {
  console.log('Connected to broker');
  mqttClient.subscribe('device');
  mqttTopics.forEach(topic => {
    mqttClient.subscribe(topic);
  });
  mqttTopics1.forEach(topic => {
    mqttClient.subscribe(topic);
  });
  watertopics.forEach(topic => {
    mqttClient.subscribe(topic);
  });
  planttopics.forEach(topic => {
    mqttClient.subscribe(topic);
  });

});

mqttClient.on('message', function (topic, message) {
  console.log(topic, message.toString());
});
mqttClient.on('message', (topic, message) => {
  const index = mqttTopics.indexOf(topic);
  if (index !== -1) {
      sensorData[`sensor${index + 1}`] = message.toString();
      console.log(`Received sensor data for Sensor ${index + 1}:, sensorData[sensor${index + 1}]`);
      // Send sensor data to all connected WebSocket clients
      wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(sensorData));
          }
      });
  }
});

mqttClient.on('message', (topic, message) => {
  const index = mqttTopics1.indexOf(topic);
  if (index !== -1) {
      healthData[`value${index + 1}`] = message.toString();
      console.log(`Received value Sensor ${index + 1}:, healthData[value${index + 1}]`);
      wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(healthData));
          }
      });
  }
});
mqttClient.on('message', (topic, message) => {
  const index = watertopics.indexOf(topic);
  if (index !== -1) {
      waterData[`water${index + 1}`] = message.toString();
      console.log(`Received water data Sensor ${index + 1}:, waterData[water${index + 1}]`);
      wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(waterData));
          }
      });
  }
});
mqttClient.on('message', (topic, message) => {
  const index = planttopics.indexOf(topic);
  if (index !== -1) {
      plantData[`plant${index + 1}`] = message.toString();
      console.log(`Received plant data Sensor ${index + 1}:, plantData[plant${index + 1}]`);
      wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(plantData));
          }
      });
  }
});
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.send(JSON.stringify({ buttonState }));
  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
  });
});

const handleButtonAction = (state, res, value, clients, topic) => {
  state = value;
  res.json(`{ message: ${value === 'true' ? 'On' : 'Off'} button pressed }`);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(value);
    }
  });
  mqttClient.publish(topic, value);
};

app.post('/:state', (req, res) => {
  const { state } = req.params;
  switch (state) {
    case 'true':
      handleButtonAction(buttonState, res, '1', wss.clients, 'device');
      break;
    case 'false':
      handleButtonAction(buttonState, res, '2', wss.clients, 'device');
      break;
    case 'on':
      handleButtonAction(fanState, res, '3', wss.clients, 'device');
      break;
    case 'off':
      handleButtonAction(fanState, res, '4', wss.clients, 'device');
      break;
    case 'one':
      handleButtonAction(lightState, res, '5', wss.clients, 'device');
      break;
    case 'zero':
      handleButtonAction(lightState, res, '6', wss.clients, 'device');
      break;
    case 'up':
      handleButtonAction(motorState, res, '7', wss.clients, 'device');
      break;
    case 'down':
      handleButtonAction(motorState, res, '8', wss.clients, 'device');
      break;
    default:
      res.status(400).json({ message: 'Invalid state' });
  }
});

app.get('/get-action', (req, res) => {
  res.json({ buttonState });
});

app.get('/get-fan', (req, res) => {
  res.json({ fanState });
});

app.get('/get-light', (req, res) => {
  res.json({ lightState });
});

app.get('/get-motor', (req, res) => {
  res.json({ motorState });
});

app.get('/sensorData', (req, res) => {
  res.json(sensorData);
});
app.get('/healthData', (req, res) => {
  res.json(healthData);
});

app.get('/waterData', (req, res) => {
  res.json(waterData);
});

app.get('/plantData', (req, res) => {
  res.json(plantData);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});