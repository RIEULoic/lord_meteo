import { Routes, Route, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CityPage from "./pages/CityPage";
import LocalStorageDisplay from "./components/LocalStorageDisplay";
import Forecast from "./pages/Forecast";
import Button from "./components/Button";

import "./App.css";

function App() {
  const [citiesData, setCitiesData] = useState([]);
  const [resetCitiesData, setResetCitiesData] = useState(false);
  const [cityName, setCityName] = useState("");

  console.log(`citiesData : ${JSON.stringify(citiesData, null, 2)}`);
  //console.log(`citiesData : ${citiesData}`);

  const location = useLocation();
  const isCityRoute = location.pathname.includes("city");
  //useLocation permet de récupérer l'URL actuelle. Ici, on vérifie si l'URL contient "city" pour afficher le bouton "Revenir à l'accueil" ou non.
  //useParams ne fonctionne que dans les composants qui sont dans une Route. Ici, on est dans App(pas de Route), donc on utilise useLocation.
  const isForecastRoute = location.pathname.includes("forecast");

  useEffect(() => {
    //Récupère les données du localStorage
    const storedCitiesData = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const cityData = localStorage.getItem(key);
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
    if (localStorage.getItem("temporaryCity") !== null && !isForecastRoute) {
      localStorage.removeItem("temporaryCity");
    }
  }

  function handleForecastButton(cityName, latitude, longitude) {
    setCityName(cityName);
    const cityLinkedForecast = {
      timestamp: "temporaryCity",
      url: `/city/${cityName.toLowerCase().replace(/\s/g, "")}`,
      name: cityName,
      geoCode: {
        latitude: latitude,
        longitude: longitude,
      },
    };

    localStorage.setItem(
      cityLinkedForecast.timestamp,
      JSON.stringify(cityLinkedForecast)
    );
    //Obligé de créer un objet cityToSave car JSON.stringify ne fonctionne pas sur un objet avec des références circulaires (visiblement city a une référence circulaire quelque part dans ses propriétés)
  }

  return (
    <div className="App">
      <h1 className="titleApp">Lord Meteo</h1>
      {isCityRoute ? (
        <div>
          {isForecastRoute ? (
            <div id="backPage">
              <Link to={JSON.parse(localStorage.getItem("temporaryCity")).url}>
                <Button onClick={handleResetCitiesData}>
                  Revenir à la page précédente
                </Button>
              </Link>
            </div>
          ) : (
            <div id="backHome">
              <Link to="/">
                <Button onClick={handleResetCitiesData}>
                  Revenir l'accueil
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <Navbar handleCitiesData={handleCitiesData} />
          <LocalStorageDisplay />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home citiesData={citiesData} />} />
        <Route
          path="city/:citySlug"
          element={
            <CityPage
              citiesData={citiesData}
              handleForecastButton={handleForecastButton}
            />
          }
        />

        <Route
          path="city/:citySlug/forecast/:forecastSlug/:daySlug?"
          //:daySlug? signifie que le paramètre est optionnel
          element={<Forecast city={cityName} />}
        />
      </Routes>
    </div>
  );
}

export default App;
