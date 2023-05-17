import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CityPage from "./pages/CityPage";
import LocalStorageDisplay from "./components/LocalStorageDisplay";

import "./App.css";

function App() {
  const [citiesData, setcitiesData] = useState([]);
  const [localStorageIndex, setLocalStorageIndex] = useState(0);

  const location = useLocation();
  const isCityRoute = location.pathname.includes("city");
  //useLocation permet de récupérer l'URL actuelle. Ici, on vérifie si l'URL contient "city" pour afficher le bouton "Revenir à l'accueil" ou non.
  //useParams ne fonctionne que dans les composants qui sont dans une Route. Ici, on est dans App(pas de Route), donc on utilise useLocation.

  function handleCitiesData(data) {
    setcitiesData(data);
  }

  return (
    <div className="App">
      <h1>Lord Meteo</h1>
      {isCityRoute ? (
        <div>
          <button>
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
