import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Forecast = ({ city }) => {
  const [forecastData, setForecastData] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [currentDate, setCurrentDate] = useState({});
  const { daySlug, forecastSlug } = useParams();

  useEffect(() => {
    retrieveWeathereForecast();
  }, [forecastSlug]);

  async function retrieveWeathereForecast() {
    let cityLatitude = forecastSlug.split("+")[0].slice(0, -1);
    console.log(cityLatitude);
    let cityLongitude = forecastSlug.split("+")[1];
    console.log(cityLongitude);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${cityLatitude}&lon=${cityLongitude}&appid=${process.env.REACT_APP_OWM_KEY}&units=metric&lang=fr`
      );
      const data = await response.json();
      setForecastData(data);

      if (daySlug !== undefined) {
        let currentSelectedDate = new Date(
          data.daily[daySlug].dt * 1000
        ).toLocaleDateString("fr-FR");
        let sunriseDate = new Date(
          data.daily[daySlug].sunrise * 1000
        ).toLocaleTimeString("fr-FR");
        //Une autre façon de récupérer la date au format US, puis formater la date en français. Je n'ai pas utilisé la même méthode que dans CityPage.jsx
        let sunsetDate = new Date(
          data.daily[daySlug].sunset * 1000
        ).toLocaleTimeString("fr-FR");

        setSelectedDate({
          date: currentSelectedDate,
          sunrise: sunriseDate,
          sunset: sunsetDate,
        });
      } else {
        let date = new Date(data.current.dt * 1000).toLocaleDateString("fr-FR");
        let sunriseDate = new Date(
          data.current.sunrise * 1000
        ).toLocaleTimeString("fr-FR");
        let sunsetDate = new Date(
          data.current.sunset * 1000
        ).toLocaleTimeString("fr-FR");
        setCurrentDate({
          date: date,
          sunrise: sunriseDate,
          sunset: sunsetDate,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div>
      <h1>{city}</h1>
      {/* {console.log(currentDate)} */}
      {forecastData.hourly && forecastData.daily ? (
        daySlug ? (
          <div>
            <h1>Meteo à J + {daySlug}</h1>
            <h1>{selectedDate.date}</h1>
            <h2>Levée du soleil : {selectedDate.sunrise}</h2>
            <h2>Couché du soleil : {selectedDate.sunset}</h2>

            <h2>
              Température minimale : {forecastData.daily[daySlug].temp.min} °
              Celsius
            </h2>
            <h2>
              Température maximale : {forecastData.daily[daySlug].temp.max} °
              Celsius
            </h2>
            <h2>Taux d'humidité : {forecastData.daily[daySlug].humidity} %</h2>
            <h2>
              Vitesse du vent : {forecastData.daily[daySlug].wind_speed} m/s
            </h2>
            <h2>Nuages : {forecastData.daily[daySlug].clouds} %</h2>
            <h3>{forecastData.daily[daySlug].summary}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${forecastData.daily[daySlug].weather[0].icon}@2x.png`}
              alt={forecastData.daily[daySlug].weather[0].description}
            />
          </div>
        ) : (
          <div>
            <h1>Aujourd'hui</h1>
            <h1>{currentDate.date}</h1>
            <h2>Levée du soleil : {currentDate.sunrise}</h2>
            <h2>Couché du soleil : {currentDate.sunset}</h2>
            <div>
              <h1>En ce moment</h1>
              <h2>Température : {forecastData.current.temp} ° Celsius </h2>
              <h2>Taux d'humidité : {forecastData.current.humidity} %</h2>
              <h2>Vitesse du vent : {forecastData.current.wind_speed} m/s</h2>
              <h2>Nuages : {forecastData.current.clouds} %</h2>
              <img
                src={`https://openweathermap.org/img/wn/${forecastData.current.weather[0].icon}@2x.png`}
                alt={forecastData.current.weather[0].description}
              />
              <div>
                <h1>Prévisions pour les prochaines 24 heures</h1>
              </div>
            </div>
          </div>
        )
      ) : (
        <h1>Chargement...</h1>
      )}
    </div>
  );
};

export default Forecast;
