import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CityPage from "./pages/CityPage";
import LocalStorageDisplay from "./components/LocalStorageDisplay";

import "./App.css";

function App() {
  const [citiesData, setCitiesData] = useState([]);
  const [localStorageIndex, setLocalStorageIndex] = useState(0);
  const [resetCitiesData, setResetCitiesData] = useState(false);

  console.log(`citiesData : ${JSON.stringify(citiesData, null, 2)}`);
  console.log(`citiesData : ${citiesData}`);

  const location = useLocation();
  const isCityRoute = location.pathname.includes("city");
  //useLocation permet de récupérer l'URL actuelle. Ici, on vérifie si l'URL contient "city" pour afficher le bouton "Revenir à l'accueil" ou non.
  //useParams ne fonctionne que dans les composants qui sont dans une Route. Ici, on est dans App(pas de Route), donc on utilise useLocation.

  useEffect(() => {
    //Récupère les données du localStorage
    const storedCitiesData = [];
    for (let i = 1; i <= 5; i++) {
      const cityData = localStorage.getItem(i);
      if (cityData) {
        storedCitiesData.push(JSON.parse(cityData));
      }
    }

    setCitiesData(storedCitiesData);
  }, [resetCitiesData]);

  function handleCitiesData(data) {
    setCitiesData(data);
  }

  function handleResetCitiesData() {
    setResetCitiesData(!resetCitiesData);
  }

  return (
    <div className="App">
      <h1>Lord Meteo</h1>
      {isCityRoute ? (
        <div>
          <button onClick={handleResetCitiesData}>
            <Link to="/">Revenir à l'accueil</Link>
          </button>
        </div>
      ) : (
        <>
          <Navbar handleCitiesData={handleCitiesData} />
          <LocalStorageDisplay />
          <div>________________________________</div>
        </>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              citiesData={citiesData}
              localStorageIndex={localStorageIndex}
              setLocalStorageIndex={setLocalStorageIndex}
            />
          }
        />
        <Route
          path="city/:citySlug"
          element={<CityPage citiesData={citiesData} />}
        />
      </Routes>
    </div>
  );
}

export default App;
