import React, { useState, useEffect, useRef } from 'react';
import { Client, Message } from 'paho-mqtt';
import './App.css';
import tapImage from './tap.png';

function App() {
  const [tapStatus, setTapStatus] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [kraanSnelheid, setKraanSnelheid] = useState(0);
  const [wasbakSnelheid, setWasbakSnelheid] = useState(0);
  const [waterLevelHistory, setWaterLevelHistory] = useState([]);

  const client = useRef(null);

  useEffect(() => {
    // comment de onderste lijnen uit om de mqtt in te schakelen
    /*
    client.current = new Client('wss://broker.hivemq.com/mqtt', 'clientId');

    const onConnect = () => {
      console.log('Connected to MQTT broker');
    };

    client.current.connect({
      onSuccess: onConnect,
    });
    */

    const intervalId = setInterval(() => {
      if (tapStatus) {
        let newWaterLevel = waterLevel + (kraanSnelheid / 60) 
        if (newWaterLevel > 100) newWaterLevel = 100;
        if (newWaterLevel >= inputLevel) {
          setTapStatus(false);
        }
        setWaterLevel(newWaterLevel);

        // Behoudt 10 oude waterlevels. Dit dient voor de moving average filter
        const newWaterLevelHistory = [...waterLevelHistory, newWaterLevel].slice(-10);
        setWaterLevelHistory(newWaterLevelHistory);
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
      // mqtt comment
      // client.current.disconnect();
    };
  }, [tapStatus, waterLevel, kraanSnelheid, inputLevel, waterLevelHistory]);

  const calculateDifference = () => {
    const sinkCapacity = 100; // The full capacity of the sink is 100%
    const difference = sinkCapacity - waterLevel;
    return difference.toFixed(2);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setTapStatus(true);
    setKraanSnelheid(8);

    // Mqtt comment
    /*
    if (client.current.isConnected()) {
      var message = new Message(inputLevel.toString());
      message.destinationName = "home/waterlevel";
      client.current.send(message);
    }
    */
  };

  const movingAverageWaterLevel = waterLevelHistory.reduce((a, b) => a + b, 0) / waterLevelHistory.length;

  return (
    <div className="App">
      <div className="tap">
        <img src={tapImage} alt="tap" />
        {tapStatus && <div className="waterStream" />}
      </div>
      <div className="sink">
        <div className="water" style={{ height: `${waterLevel}%` }} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="desired-level">Wensniveau: </label>
          <input type="number" id="desired-level" onChange={(e) => setInputLevel(e.target.value)} />
          <button type="submit">Verzend</button>
        </div>
      </form>
      <p>Waterniveau: {waterLevel.toFixed(2)}%</p>
      <p>Vulsnelheid: {kraanSnelheid} liter/min</p>
      <p>Remaining capacity: {calculateDifference()}%</p>
      {/*       Functie voor het leeg laten lopen van de wasbak
 <p>Vulsnelheid: {tapStatus ? wasbakSnelheid : 0} liter/min</p> */}
    </div>
  );
}

export default App;
