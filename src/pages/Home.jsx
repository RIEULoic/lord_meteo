import { Link } from "react-router-dom";
import Button from "../components/Button";

import "./Home.css";

const Home = ({ citiesData }) => {
  console.log(citiesData);

  function handleSaveLocalStorage(cityData) {
    //console.log(city);
    const cityToSave = {
      timestamp: Date.now(),
      name: cityData.name,
      geoCode: {
        latitude: cityData.geoCode.latitude,
        longitude: cityData.geoCode.longitude,
      },
      //Je sauvegarde les datas avec la même structure JSON que dans la réponse API
    };

    localStorage.setItem(cityToSave.timestamp, JSON.stringify(cityToSave));
    //Obligé de créer un objet cityToSave car JSON.stringify ne fonctionne pas sur un objet avec des références circulaires (visiblement cityData a une référence circulaire quelque part dans ses propriétés)

    // Vérification du nombre de villes enregistrées
    if (localStorage.length > 5) {
      let oldestTimestamp = null;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        //console.log(key);
        const timestamp = Number(key);
        //key est une string, je la convertis en number

        // Mise à jour du timestamp le plus ancien
        if (oldestTimestamp === null || timestamp < oldestTimestamp) {
          oldestTimestamp = timestamp;
        }
      }
      localStorage.removeItem(String(oldestTimestamp));
      //String(oldestTimestamp) car localStorage.removeItem fonctionne avec une string et pas avec number
    }
  }

  return (
    <div className="home">
      <div className="cityButton">
        {console.log(citiesData)}
        {citiesData ? (
          citiesData.map((city) => {
            let cityInLocalStorage = false;
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              const storedCity = JSON.parse(localStorage.getItem(key));
              if (storedCity && storedCity.name === city.name) {
                cityInLocalStorage = true;
                //Si la ville est déjà dans le localStorage(cityInLocalStorage = true), on ne l'affiche pas (return cityInLocalStorage ? null : (<Button......</Button>))
              }
            }
            return cityInLocalStorage ||
              !city.geoCode ||
              !city.geoCode.latitude ||
              !city.geoCode.longitude ? null : (
              <Link to={`/city/${city.name.toLowerCase().replace(/\s/g, "")}`}>
                <Button
                  key={
                    city.geoCode?.latitude !== undefined ||
                    city.geoCode?.longitude !== undefined
                      ? `${city.geoCode.latitude} ${
                          city.geoCode.longitude
                        } ${Math.random()}`
                      : `${Math.random()}`
                  }
                  onClick={() => handleSaveLocalStorage(city)}
                  //Si tu écris onClick={handleSaveLocalStorage(city)}, la fonction s'exécute tout le temps
                >
                  {city.name} {city.address.countryCode}
                </Button>
              </Link>
            );
          })
        ) : (
          <h1>Aucunes villes trouvées</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
