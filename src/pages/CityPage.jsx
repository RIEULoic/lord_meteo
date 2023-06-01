import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button";

const CityPage = ({ citiesData, handleForecastButton }) => {
  const { citySlug, forecastSlug } = useParams();
  const [currentCity, setCurrentCity] = useState(null);
  const [weatherData, setWeatherData] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  let date = "";

  useEffect(() => {
    console.log(citiesData);
    //console.log(forecastSlug);
    const city = citiesData.find(
      (city) =>
        city.name.toLowerCase().replace(/\s/g, "") === citySlug &&
        !city.geoCode.latitude === false &&
        !city.geoCode.longitude === false
    );
    setCurrentCity(city);
    console.log(city);
  }, [citySlug, forecastSlug]);

  useEffect(() => {
    if (currentCity && currentCity.geoCode) {
      fetchOpenWeatherMap();
    }
  }, [currentCity, forecastSlug]);

  async function fetchOpenWeatherMap() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${currentCity.geoCode.latitude}&lon=${currentCity.geoCode.longitude}&appid=${process.env.REACT_APP_OWM_KEY}&units=metric&lang=fr`
      );
      const data = await response.json();
      console.log(data);

      date = new Date(data.current.dt * 1000);
      //Cette ligne de code permet de convertir le timestamp en date (ex: 1620735450 => 08/30/2021 )
      //console.log(new Intl.DateTimeFormat("fr-FR").format(date));
      setCurrentDate(new Intl.DateTimeFormat("fr-FR").format(date));
      //Cette ligne de code permet de formater la date en français (ex: 30/08/2021)

      setWeatherData(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      {currentCity && currentCity.geoCode && weatherData.current ? (
        <div>
          <h1>City: {currentCity.name}</h1>
          <h2>Latitude : {currentCity.geoCode.latitude}</h2>
          <h2>Longitude : {currentCity.geoCode.longitude}</h2>
          <div>_____________________________________</div>
          <div>
            <h1>Météo en ce moment :</h1>
            <h2>{currentDate}</h2>
            <h2>Temps : {weatherData.current.weather[0].description}</h2>
            <img
              src={`https:openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`}
              alt={weatherData.current.weather[0].description}
            />
            <h2>Temperature : {weatherData.current.temp} ° Celsius</h2>
            <Button
              onClick={() =>
                handleForecastButton(
                  currentCity.name,
                  currentCity.geoCode.latitude,
                  currentCity.geoCode.longitude
                )
              }
            >
              {console.log(weatherData.current.temp)}
              <Link
                to={`/city/${currentCity.name
                  .toLowerCase()
                  .replace(/\s/g, "")}/forecast/${
                  currentCity.geoCode.latitude
                }_${currentCity.geoCode.longitude}`}
              >
                Prévisions de la journée
              </Link>
            </Button>
          </div>

          <div>_____________________________________</div>
          <h1>Prévisions météo pour les 5 prochains jours :</h1>
          {
            //slice permet de selectionner les  5 jours suivants et ensuite on map sur ces 5 jours
            weatherData.daily.slice(1, 6).map((day, index) => (
              <div key={index}>
                <h3>
                  J + {index + 1} : {day.weather[0].description}
                </h3>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <div>
                  <h4>min : {day.temp.min} °</h4>
                  <h4>max : {day.temp.max} °</h4>
                </div>
                <Button
                  onClick={() =>
                    handleForecastButton(
                      currentCity.name,
                      currentCity.geoCode.latitude,
                      currentCity.geoCode.longitude
                    )
                  }
                >
                  {console.log(weatherData.current.temp)}
                  <Link
                    city={currentCity.name}
                    to={`/city/${currentCity.name
                      .toLowerCase()
                      .replace(/\s/g, "")}/forecast/${
                      currentCity.geoCode.latitude
                    }_${currentCity.geoCode.longitude}/${index + 1}`}
                  >
                    Plus d'infos sur la journée
                  </Link>
                </Button>
              </div>
            ))
          }
        </div>
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
};

export default CityPage;
