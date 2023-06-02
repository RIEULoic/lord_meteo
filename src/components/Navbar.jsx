import { useEffect, useState } from "react";

import "./Navbar.css";

const Navbar = ({ handleCitiesData }) => {
  const [accessToken, setAccessToken] = useState("");
  const [searchInput, setsearchInput] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    requestNewAccessToken();
  }, []);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      //Si searchInput change à nouveau avant que le délai ne soit terminé, l'ancien délai est annulé et un nouveau est créé
    }
    if (searchInput.length >= 3) {
      setDebounceTimer(setTimeout(fetchcitiesData, 500));
      //Cette ligne crée un délai qui déclenche la fonction fetchcitiesData après 500 millisecondes. Si l'utilisateur continue à taper, le délai est annulé et un nouveau délai est créé (voir au dessus)
    } else {
      handleCitiesData([]);
    }
    return () => {
      //Cette fonction est appelée lorsque le composant est démonté. Elle annule le délai en cours pour éviter que la fonction fetchcitiesData ne soit appelée après le démontage du composant
      clearTimeout(debounceTimer);
    };
  }, [searchInput]);

  async function requestNewAccessToken() {
    try {
      const clientId = process.env.REACT_APP_AMADEUS_ID;
      const clientSecret = process.env.REACT_APP_AMADEUS_KEY;

      const newAccessToken = await getAccessToken(clientId, clientSecret);
      console.log("Nouveau token demandé");
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAccessToken(clientId, clientSecret) {
    try {
      const tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchcitiesData() {
    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations/cities?keyword=${searchInput}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const responseBody = await response.json();
      if (responseBody.data) {
        responseBody.data.forEach((city) => {
          console.log(city.name);
        });
        handleCitiesData(responseBody.data);

        // console.log("Villes trouvées " + data.data[0].name);
      } else if (responseBody.errors?.[0].code === 38192) {
        //Si data.errors n'existe pas, la condition ne sera simplement pas satisfaite et le code continuera de s'exécuter sans erreur. Sinon tu te prends un data.errors is undefined
        requestNewAccessToken();
        console.log("Token expiré");
        fetchcitiesData();
      } else if (responseBody.warnings?.[0].code === 1797) {
        //Si data.warnings n'existe pas, la condition ne sera simplement pas satisfaite et le code continuera de s'exécuter sans erreur.Sinon tu te prends un data.warnings is undefined
        console.log("Aucune ville trouvée");
        handleCitiesData(undefined);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleInputChange(e) {
    setsearchInput(e.target.value);
  }

  return (
    <nav className="navbar">
      <div>
        <input
          id="search-bar"
          type="text"
          placeholder="Chercher une ville"
          onChange={handleInputChange}
        />
      </div>
    </nav>
  );
};

export default Navbar;
