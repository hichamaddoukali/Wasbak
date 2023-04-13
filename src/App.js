import React, { useState, useEffect } from "react";
import "./App.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import mqtt from "mqtt";

function App() {

  useEffect(() => {
    const mqttClient = mqtt.connect("9b0857782fa3475eb8e2e016edd70948.s2.eu.hivemq.cloud");

    mqttClient.on("connect", () => {
      console.log("Connected to HiveMQ broker");
      mqttClient.subscribe("myApp/waterUsage/dataset3"); // Verander 'your/topic' in uw gewenste topic
    });

    mqttClient.on("message", (topic, message) => {
      const parsedMessage = JSON.parse(message.toString());
      console.log("Received message:", topic, parsedMessage);
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  const [data1, setData1] = useState([
    { time: "00:00", litersPerMin: 10 },
    { time: "01:00", litersPerMin: 15 },
    { time: "02:00", litersPerMin: 12 },
    { time: "03:00", litersPerMin: 8 },
    { time: "04:00", litersPerMin: 20 },
  ]);

  const [data2, setData2] = useState([
    { time: "05:00", litersPerMin: 25 },
    { time: "06:00", litersPerMin: 30 },
    { time: "07:00", litersPerMin: 35 },
    { time: "08:00", litersPerMin: 40 },
    { time: "09:00", litersPerMin: 45 },
  ]);

  const [data3, setData3] = useState([
    { time: "10:00", litersPerMin: 30 },
    { time: "11:00", litersPerMin: 28 },
    { time: "12:00", litersPerMin: 25 },
    { time: "13:00", litersPerMin: 30 },
    { time: "14:00", litersPerMin: 20 },
  ]);

  const updateData = (datasetIndex, dataIndex, litersPerMin) => {
    if (datasetIndex === 1) {
      const newData = [...data1];
      newData[dataIndex].litersPerMin = Number(litersPerMin);
      setData1(newData);
    } else if (datasetIndex === 2) {
      const newData = [...data2];
      newData[dataIndex].litersPerMin = Number(litersPerMin);
      setData2(newData);
    } else {
      const newData = [...data3];
      newData[dataIndex].litersPerMin = Number(litersPerMin);
      setData3(newData);
    }
  };

  const renderForm = (datasetIndex, data) => (
    <div>
      {data.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <label>
            {item.time} - Waterverbruik (liters/min):{" "}
            <input
              type="number"
              value={item.litersPerMin}
              onChange={(e) => updateData(datasetIndex, index, e.target.value)}
            />
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      <h1>Staafdiagrammen - Waterverbruik (liters/min)</h1>
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        
        <div className="chart-container">
      {renderForm(1, data1)}  
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data1}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="litersPerMin" name="Waterniveau" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        </div>

        <div className="chart-container">
        {renderForm(2, data2)}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="litersPerMin" name="Watertoevoer" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          {renderForm(3, data3)}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data3}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="litersPerMin" name="Waterafvoer" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;

