import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CityPage = ({ citiesData }) => {
  const { citySlug } = useParams();
  const [currentCity, setCurrentCity] = useState("");
  const [weatherData, setWeatherData] = useState("");

  useEffect(() => {
    console.log(citiesData);
    const city = citiesData.find(
      (city) =>
        city.name.toLowerCase().replace(/\s/g, "") === citySlug &&
        !city.geoCode.latitude === false &&
        !city.geoCode.longitude === false
    );
    setCurrentCity(city);
    console.log(city);
  }, [citySlug]);

  useEffect(() => {
    if (currentCity.geoCode) {
      fetchOpenWeatherMap();
    }
  }, [currentCity]);

  async function fetchOpenWeatherMap() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${currentCity.geoCode.latitude}&lon=${currentCity.geoCode.longitude}&appid=${process.env.REACT_APP_OWM_KEY}&units=metric`
      );

      const data = await response.json();
      console.log(data);
      setWeatherData(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      {currentCity.geoCode && weatherData.current ? (
        <>
          <h1>City: {currentCity.name}</h1>
          <h2>Latitude : {currentCity.geoCode.latitude}</h2>
          <h2>Longitude : {currentCity.geoCode.longitude}</h2>
          <h2>Temperature : {weatherData.current.temp} ° Celsius</h2>
        </>
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
};

export default CityPage;
