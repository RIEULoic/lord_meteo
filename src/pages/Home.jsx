import { Link } from "react-router-dom";
import { useState } from "react";

const Home = ({
  citiesData,
  localStorageIndex,
  setLocalStorageIndex,
  resetCitiesData,
  setResetCitiesData,
}) => {
  console.log(citiesData);

  function handleSaveLocalStorage(cityData) {
    //console.log(city);
    const cityToSave = {
      cityIndex: (localStorageIndex % 5) + 1,
      //Le modulo du cul permet que l'index ne dépasse pas 5. Si l'index dépasse 5, on revient à 1.
      name: cityData.name,
      geoCode: {
        latitude: cityData.geoCode.latitude,
        longitude: cityData.geoCode.longitude,
      },
    };

    localStorage.setItem(cityToSave.cityIndex, JSON.stringify(cityToSave));
    //Obligé de créer un objet cityToSave car JSON.stringify ne fonctionne pas sur un objet avec des références circulaires (visiblement city a une référence circulaire quelque part dans ses propriétés)

    //setLocalStorageIndex(localStorageIndex + 1);
    setLocalStorageIndex((prevIndex) => prevIndex + 1);
    //setLocalStorageIndex((prevIndex) => prevIndex + 1) permet de récupérer la valeur précédente de localStorageIndex et de l'utiliser dans le setLocalStorageIndex. Si on utilise setLocalStorageIndex(localStorageIndex + 1), on récupère la valeur actuelle de localStorageIndex, qui est 0, et on lui ajoute 1. Donc on a toujours 1.
  }

  return (
    <div>
      <h1>Home</h1>
      <div>
        {console.log(citiesData)}
        {citiesData ? (
          citiesData.map((city) => {
            let cityInLocalStorage = false;
            for (let i = 1; i <= 5; i++) {
              const storedCity = JSON.parse(localStorage.getItem(i));
              if (storedCity && storedCity.name === city.name) {
                cityInLocalStorage = true;
              }
            }
            return cityInLocalStorage ? null : (
              <button
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
                <Link
                  to={`/city/${city.name.toLowerCase().replace(/\s/g, "")}`}
                >
                  {city.name}
                </Link>
              </button>
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
