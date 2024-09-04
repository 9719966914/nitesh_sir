import React, { useEffect, useState } from "react";
import "./App.css";
import * as XLSX from 'xlsx';

function App() {
  const [g11, setg11] = useState("Not in range");
  const [g12, setg12] = useState("Not in range");
  const [g13, setg13] = useState("Not in range");
  const [g14, setg14] = useState("Not in range");
  const [g15, setg15] = useState("Not in range");
  const [g21, setg21] = useState("Not in range");
  const [g22, setg22] = useState("Not in range");
  const [g23, setg23] = useState("Not in range");
  const [g24, setg24] = useState("Not in range");
  const [g25, setg25] = useState("Not in range");
  const [g31, setg31] = useState("Not in range");
  const [g32, setg32] = useState("Not in range");
  const [g33, setg33] = useState("Not in range");
  const [g34, setg34] = useState("Not in range");
  const [g35, setg35] = useState("Not in range");
  const [r11, setr11] = useState("Not in range");
  const [r12, setr12] = useState("Not in range");
  const [r13, setr13] = useState("Not in range");
  const [r14, setr14] = useState("Not in range");
  const [r15, setr15] = useState("Not in range");
  const [r21, setr21] = useState("Not in range");
  const [r22, setr22] = useState("Not in range");
  const [r23, setr23] = useState("Not in range");
  const [r24, setr24] = useState("Not in range");
  const [r25, setr25] = useState("Not in range");
  const [r31, setr31] = useState("Not in range");
  const [r32, setr32] = useState("Not in range");
  const [r33, setr33] = useState("Not in range");
  const [r34, setr34] = useState("Not in range");
  const [r35, setr35] = useState("Not in range");

  const [mqttData, setMqttData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('Select Time');
  const [allData, setAllData] = useState([]); // Store all data to append

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/data");
        const result = await response.json();
        const parsedData = result?.data;
        console.log(parsedData);
        
        setMqttData(prevData => [...prevData, parsedData]);
        setAllData(prevData => [...prevData, parsedData]); // Append new data to existing data
        
        // Distnace value setting
        const updateDistance = (gateway, tagMac, setter) => {
          if (parsedData.gateway === gateway && [tagMac.toLowerCase(), tagMac.toUpperCase()].includes(parsedData["tag-mac"])) {
            setter(parseFloat(parsedData.distance.toFixed(2)));
          }
        };

        updateDistance("ac233fc18c3f", "c30000289002", setg11);
        updateDistance("ac233fc18c3f", "c30000289003", setg12);
        updateDistance("ac233fc18c3f", "c30000288ffe", setg13);
        updateDistance("ac233fc18c3f", "c30000288ffc", setg14);
        updateDistance("ac233fc18c3f", "c30000288ffb", setg15);
        
        updateDistance("ac233fc18c39", "c30000289002", setg21);
        updateDistance("ac233fc18c39", "c30000289003", setg22);
        updateDistance("ac233fc18c39", "c30000288ffe", setg23);
        updateDistance("ac233fc18c39", "c30000288ffc", setg24);
        updateDistance("ac233fc18c39", "c30000288ffb", setg25);
        
        updateDistance("ac233fc179f8", "c30000289002", setg31);
        updateDistance("ac233fc179f8", "c30000289003", setg32);
        updateDistance("ac233fc179f8", "c30000288ffe", setg33);
        updateDistance("ac233fc179f8", "c30000288ffc", setg34);
        updateDistance("ac233fc179f8", "c30000288ffb", setg35);
        
        // RSSI value setting
        const updateRssi = (gateway, tagMac, setter) => {
          if (parsedData.gateway === gateway && [tagMac.toLowerCase(), tagMac.toUpperCase()].includes(parsedData["tag-mac"])) {
            setter(parsedData.rssi);
          }
        };

        updateRssi("ac233fc18c3f", "c30000289002", setr11);
        updateRssi("ac233fc18c3f", "c30000289003", setr12);
        updateRssi("ac233fc18c3f", "c30000288ffe", setr13);
        updateRssi("ac233fc18c3f", "c30000288ffc", setr14);
        updateRssi("ac233fc18c3f", "c30000288ffb", setr15);
        
        updateRssi("ac233fc18c39", "c30000289002", setr21);
        updateRssi("ac233fc18c39", "c30000289003", setr22);
        updateRssi("ac233fc18c39", "c30000288ffe", setr23);
        updateRssi("ac233fc18c39", "c30000288ffc", setr24);
        updateRssi("ac233fc18c39", "c30000288ffb", setr25);
        
        updateRssi("ac233fc179f8", "c30000289002", setr31);
        updateRssi("ac233fc179f8", "c30000289003", setr32);
        updateRssi("ac233fc179f8", "c30000288ffe", setr33);
        updateRssi("ac233fc179f8", "c30000288ffc", setr34);
        updateRssi("ac233fc179f8", "c30000288ffb", setr35);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, fileName);
  };

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const filterDataByTimeFrame = () => {
    const now = new Date();
    let filteredData = [];
    switch (timeFrame) {
      case '1 hours':
        filteredData = allData.filter(item => new Date(item.timestamp) >= new Date(now - 60 * 60 * 1000));
        break;
      case '2 hours':
        filteredData = allData.filter(item => new Date(item.timestamp) >= new Date(now - 2 * 60 * 60 * 1000));
        break;
      case '3 hours':
        filteredData = allData.filter(item => new Date(item.timestamp) >= new Date(now - 3 * 60 * 60 * 1000));
        break;
      case '1 day':
        filteredData = allData.filter(item => new Date(item.timestamp) >= new Date(now - 24 * 60 * 60 * 1000));
        break;
      default:
        filteredData = allData;
    }
    return filteredData;
  };

  const handleDownload = () => {
    const filteredData = filterDataByTimeFrame();
    saveToExcel(filteredData, 'MQTT_Data.xlsx');
  };

  return (
    <div className="App">
    <div className="button-top-right">
     <label htmlFor="timeFrame">Time:</label>
     <select id="timeFrame" value={timeFrame} onChange={handleTimeFrameChange}>
       <option value="1 hours">1 Hours</option>
       <option value="2 hours">2 Hours</option>
       <option value="3 hours">3 Hours</option>
       <option value="1 day">1 Day</option>
     </select>
     <button onClick={downloadExcel}>Download Excel</button>
   </div>

   <div className="container">
   <div className="container">
     <table>
       <thead>
         <tr>
           <th>Distance</th>
           <th>C117</th>
           <th>C103</th>
           <th>C004</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td>Invigilator 1</td>
           <td>{g11}</td>
           <td>{g21}</td>
           <td>{g31}</td>
         </tr>
         <tr>
           <td>Invigilator 2</td>
           <td>{g12}</td>
           <td>{g22}</td>
           <td>{g32}</td>
         </tr>
         <tr>
           <td>Invigilator 3</td>
           <td>{g13}</td>
           <td>{g23}</td>
           <td>{g33}</td>
         </tr>
         <tr>
           <td>Invigilator 4</td>
           <td>{g14}</td>
           <td>{g24}</td>
           <td>{g34}</td>
         </tr>
         <tr>
           <td>Invigilator 5</td>
           <td>{g15}</td>
           <td>{g25}</td>
           <td>{g35}</td>
         </tr>
       </tbody>
     </table>
     <table>
       <thead>
         <tr>
           <th>Rssi</th>
           <th>C117</th>
           <th>C103</th>
           <th>C004</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td>Invigilator 1</td>
           <td>{r11}</td>
           <td>{r21}</td>
           <td>{r31}</td>
         </tr>
         <tr>
           <td>Invigilator 2</td>
           <td>{r12}</td>
           <td>{r22}</td>
           <td>{r32}</td>
         </tr>
         <tr>
           <td>Invigilator 3</td>
           <td>{r13}</td>
           <td>{r23}</td>
           <td>{r33}</td>
         </tr>
         <tr>
           <td>Invigilator 4</td>
           <td>{r14}</td>
           <td>{r24}</td>
           <td>{r34}</td>
         </tr>
         <tr>
           <td>Invigilator 5</td>
           <td>{r15}</td>
           <td>{r25}</td>
           <td>{r35}</td>
         </tr>
       </tbody>
     </table>
   </div>
   </div>
 </div>
  );
}

export default App;
