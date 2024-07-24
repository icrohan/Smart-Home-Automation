import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [buttonState, setButtonState] = useState(false);
  const [fan, setFan] = useState(false);
  const [light, setLight] = useState(false);
  const [motor, setMotor] = useState(false);
  const [sensorData, setSensorData] = useState({
    sensor1: '',
    sensor2: '',
    sensor3: '',
    sensor4: '',
    sensor5: ''
  });
  const [healthData, setHealthData] = useState({
    value1: '',
    value2: '',
    value3: '',
    value4: ''

  })
  const [waterData, setWaterData] = useState({
    water1: ''
  })
  const [plantData, setPlantData] = useState({
    plant1: '',
    plant2: ''
  })

  const handleButtonClick = async () => {
    setButtonState(!buttonState);
    try {
      const response = await fetch(`http://localhost:3001/${buttonState ? 'true' : 'false'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFanClick = async () => {
    setFan(!fan);
    const fanState = fan ? 'off' : 'on';
    try {
      const response = await fetch(`http://localhost:3001/${fanState}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLightClick = async () => {
    setLight(!light);
    const lightState = light ? 'zero' : 'one';
    try {
      const response = await fetch(`http://localhost:3001/${lightState}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMotorClick = async () => {
    setMotor(!motor);
    const motorState = motor ? 'down' : 'up';
    try {
      const response = await fetch(`http://localhost:3001/${motorState}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => {
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSensorData(data);
        setHealthData(data);
        setWaterData(data);
        setPlantData(data);
    };

    return () => {
        socket.close();
    };
}, []);

  return (
    <div className="App">
      <h1>Home Automation</h1> 
      <button onClick={handleButtonClick}>{buttonState ? 'light on' : 'light off'}</button>
      <button onClick={handleFanClick}>{fan ? 'fan on' : 'fan off'}</button>
      <button onClick={handleLightClick}>{light ? 'tv on' : 'tv off'}</button>
      <button onClick={handleMotorClick}>{motor ? 'motor on' : 'motor off'}</button>
                
      <h1>Air Quality</h1>          
      <strong>Temperature :</strong> {sensorData.sensor1} C<br />
      <strong>Humidity :</strong> {sensorData.sensor2} g/m^3<br />
      <strong>Pressure :</strong> {sensorData.sensor3} pac<br />
      <strong>Altitude :</strong> {sensorData.sensor4} m<br />
      <strong>VOC :</strong> {sensorData.sensor5} voc<br />

      <h1>Health Monitoring</h1>
      <strong>Body Temparature :</strong> {healthData.value1} C<br />
      <strong>Height :</strong> {healthData.value2} cm<br />
      <strong>Pulse :</strong> {healthData.value3} bpm<br />
      <strong>Weight :</strong> {healthData.value4} kg<br />

      <h1>Water Dispensor</h1>
      <strong>Water Available :</strong> {waterData.water1} litres<br />

      <h1>Plant Monitoring</h1>
      <strong>Soil Moisture : </strong> {plantData.plant1} %<br />
      <strong>pH : </strong> {plantData.plant2} pH<br />

      

    </div>
  );
};

export default App;