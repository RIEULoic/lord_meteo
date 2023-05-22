import { useEffect, useState } from "react";

const Navbar = ({ handleCitiesData }) => {
  const [accessToken, setAccessToken] = useState("");
  const [searchInput, setsearchInput] = useState("");

  useEffect(() => {
    requestNewAccessToken();
  }, []);

  useEffect(() => {
    if (searchInput.length >= 3) {
      fetchcitiesData();
    } else {
      handleCitiesData([]);
    }
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
      <div className="search-bar">
        <input
          type="text"
          placeholder="Chercher une ville"
          onChange={handleInputChange}
        />
      </div>
    </nav>
  );
};

export default Navbar;
