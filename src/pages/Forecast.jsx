import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "./Forecast.css";

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
    let cityLongitude = forecastSlug.split("+")[1];

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

  //DATA POUR LE GRAPHIQUE
  const dataChart = forecastData.hourly
    ? forecastData.hourly.map((hour) => ({
        hour: new Date(hour.dt * 1000).toLocaleTimeString("fr-FR").slice(0, -3),
        //le slice permet de supprimer les secondes
        temperature: hour.temp,
        humidity: hour.humidity,
        wind: hour.wind_speed,
      }))
    : [];

  return (
    <div>
      {forecastData.hourly && forecastData.daily ? (
        daySlug ? (
          <div className="forecastContainer">
            <h1 className="cityName">{city}</h1>
            <div className="cityWeatherInfo">
              <h1>Meteo à J + {daySlug}</h1>
              <h1>{selectedDate.date}</h1>
              <h2>Levée du soleil : {selectedDate.sunrise}</h2>
              <h2>Couché du soleil : {selectedDate.sunset}</h2>
            </div>
            <div className="meteo">
              <h2>
                Température minimale : {forecastData.daily[daySlug].temp.min} °
                Celsius
              </h2>
              <h2>
                Température maximale : {forecastData.daily[daySlug].temp.max} °
                Celsius
              </h2>
              <h2>
                Taux d'humidité : {forecastData.daily[daySlug].humidity} %
              </h2>
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
          </div>
        ) : (
          <div className="forecastContainer">
            <h1 className="cityName">{city}</h1>
            <div className="cityWeatherInfo">
              <h1>Aujourd'hui</h1>
              <h1>{currentDate.date}</h1>
              <h2>Levée du soleil : {currentDate.sunrise}</h2>
              <h2>Couché du soleil : {currentDate.sunset}</h2>
            </div>

            <div className="meteo">
              <h1>En ce moment</h1>
              <h2>Température : {forecastData.current.temp} ° Celsius </h2>
              <h2>Taux d'humidité : {forecastData.current.humidity} %</h2>
              <h2>Vitesse du vent : {forecastData.current.wind_speed} m/s</h2>
              <h2>Nuages : {forecastData.current.clouds} %</h2>
              <img
                src={`https://openweathermap.org/img/wn/${forecastData.current.weather[0].icon}@2x.png`}
                alt={forecastData.current.weather[0].description}
              />
            </div>
            <div id="nextHours">
              <h1>Prévisions pour les prochaines 24 heures</h1>
              <div id="chart">
                {/* Recharts en action */}
                <LineChart
                  width={375}
                  height={300}
                  data={dataChart}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff3333"
                    activeDot={{ r: 8 }}
                    // activeDot={{ r: 8 }} sert à mettre en avant le point sélectionné ?
                  />
                  <Line type="monotone" dataKey="humidity" stroke="#33f3ff" />
                  <Line type="monotone" dataKey="wind" stroke="#33ff3f" />
                </LineChart>
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
