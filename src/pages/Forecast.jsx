import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Forecast = ({ city }) => {
  const [data, setData] = useState({});
  const { daySlug, forecastSlug } = useParams();

  useEffect(() => {
    fetchOpenWeatherMapForecast();
  }, [forecastSlug]);

  async function fetchOpenWeatherMapForecast() {
    let cityLatitude = forecastSlug.split("_")[0].slice(0, -1);
    console.log(cityLatitude);
    let cityLongitude = forecastSlug.split("_")[1];
    console.log(cityLongitude);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${cityLatitude}&lon=${cityLongitude}&appid=${process.env.REACT_APP_OWM_KEY}&units=metric&lang=fr`
      );
      const data = await response.json();
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div>
      <h1>{city}</h1>
      {data.hourly && data.daily ? (
        daySlug ? (
          <div>
            <h1>Meteo à J + {daySlug}</h1>
            <h3>Température : {data.daily[daySlug].temp.day} °</h3>
          </div>
        ) : (
          <div>
            <h2>{data.hourly[0].humidity} ° d'humiditée</h2>
            <h2>{data.hourly[0].temp} ° Celsius </h2>
          </div>
        )
      ) : (
        <h1>Chargement...</h1>
      )}
    </div>
  );
};

export default Forecast;
