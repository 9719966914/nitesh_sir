import React, { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/data");
        const result = await response.json();
        const parsedData = result?.data;
        console.log(parsedData);
        setMqttData(prevData => [...prevData, parsedData]);

        // Save data to XLSX
        // saveToExcel([...mqttData, parsedData]);
        
        //distnace value setting
        if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000289002" ||
            parsedData["tag-mac"] === "C30000289002")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg11(a);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000289003" ||
            parsedData["tag-mac"] === "C30000289003")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg12(a);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000288ffe" ||
            parsedData["tag-mac"] === "C30000288FFE")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg13(a);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000288ffc" ||
            parsedData["tag-mac"] === "C30000288FFC")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg14(a);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000288ffb" ||
            parsedData["tag-mac"] === "C30000288FFB")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg15(a);
        }
        if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000289002" ||
            parsedData["tag-mac"] === "C30000289002")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg21(a);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000289003" ||
            parsedData["tag-mac"] === "C30000289003")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg22(a);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000288ffe" ||
            parsedData["tag-mac"] === "C30000288FFE")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg23(a);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000288ffc" ||
            parsedData["tag-mac"] === "C30000288FFC")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg24(a);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000288ffb" ||
            parsedData["tag-mac"] === "C30000288FFB")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg25(a);
        }
        if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000289002" ||
            parsedData["tag-mac"] === "C30000289002")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg31(a);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000289003" ||
            parsedData["tag-mac"] === "C30000289003")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg32(a);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000288ffe" ||
            parsedData["tag-mac"] === "C30000288FFE")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg33(a);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000288ffc" ||
            parsedData["tag-mac"] === "C30000288FFC")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg34(a);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000288ffb" ||
            parsedData["tag-mac"] === "C30000288FFB")
        ) {
          let a = parseFloat(parsedData.distance.toFixed(2));
          setg35(a);
        }
        //rssi value setting
        if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000289002" ||
            parsedData["tag-mac"] === "C30000289002")
        ) {
          setr11(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000289003" ||
            parsedData["tag-mac"] === "C30000289003")
        ) {
          setr12(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000288ffe" ||
            parsedData["tag-mac"] === "C30000288FFE")
        ) {
          setr13(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000288ffc" ||
            parsedData["tag-mac"] === "C30000288FFC")
        ) {
          setr14(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c3f" &&
          (parsedData["tag-mac"] === "c30000288ffb" ||
            parsedData["tag-mac"] === "C30000288FFB")
        ) {
          setr15(parsedData.rssi);
        }
        if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000289002" ||
            parsedData["tag-mac"] === "C30000289002")
        ) {
          setr21(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000289003" ||
            parsedData["tag-mac"] === "C30000289003")
        ) {
          setr22(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000288ffe" ||
            parsedData["tag-mac"] === "C30000288FFE")
        ) {
          setr23(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000288ffc" ||
            parsedData["tag-mac"] === "C30000288FFC")
        ) {
          setr24(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc18c39" &&
          (parsedData["tag-mac"] === "c30000288ffb" ||
            parsedData["tag-mac"] === "C30000288FFB")
        ) {
          setr25(parsedData.rssi);
        }
        if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000289002" ||
            parsedData["tag-mac"] === "C30000289002")
        ) {
          setr31(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000289003" ||
            parsedData["tag-mac"] === "C30000289003")
        ) {
          setr32(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000288ffe" ||
            parsedData["tag-mac"] === "C30000288FFE")
        ) {
          setr33(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000288ffc" ||
            parsedData["tag-mac"] === "C30000288FFC")
        ) {
          setr34(parsedData.rssi);
        } else if (
          parsedData.gateway === "ac233fc179f8" &&
          (parsedData["tag-mac"] === "c30000288ffb" ||
            parsedData["tag-mac"] === "C30000288FFB")
        ) {
          setr35(parsedData.rssi);
        }
        
        
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
        filteredData = mqttData.filter(item => new Date(item.timestamp) >= new Date(now -  60 * 1000));
        break;
      case '2 hours':
        filteredData = mqttData.filter(item => new Date(item.timestamp) >= new Date(now - 2 * 60 * 1000));
        break;
      case '3 hours':
        filteredData = mqttData.filter(item => new Date(item.timestamp) >= new Date(now - 3 * 60 * 1000));
        break;
      case '1 day':
        filteredData = mqttData.filter(item => new Date(item.timestamp) >= new Date(now - 24 * 60 * 60 * 1000));
        break;
      default:
        filteredData = mqttData;
    }
    return filteredData;
  };

  const downloadExcel = () => {
    const filteredData = filterDataByTimeFrame();
    const fileName = `FilteredData_${timeFrame}.xlsx`;
    saveToExcel(filteredData, fileName);
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