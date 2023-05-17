import { Routes, Route } from "react-router-dom";
import { useState } from "react";
//import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home.jsx";

function App() {
  const [citiesData, setcitiesData] = useState([]);

  function handleCitiesData(data) {
    setcitiesData(data);
  }

  return (
    <div className="App">
      {" "}
      <h1>Lord Meteo</h1>
      <Navbar handleCitiesData={handleCitiesData} />
      <Routes>
        <Route path="/" element={<Home citiesData={citiesData} />} />
      </Routes>
    </div>
  );
}

export default App;
