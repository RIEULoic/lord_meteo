import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CityPage = ({ citiesData }) => {
  const { citySlug } = useParams();
  const [currentCity, setCurrentCity] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  let date = "";

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
      {currentCity.geoCode && weatherData.current ? (
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
          </div>

          <div>_____________________________________</div>
          <h1>Prévisions météo pour les 5 prochains jours :</h1>
          <div>
            <div>
              <h3>J + 1 : {weatherData.daily[1].weather[0].description}</h3>
              <img
                src={`https:openweathermap.org/img/wn/${weatherData.daily[1].weather[0].icon}@2x.png`}
                alt={weatherData.daily[1].weather[0].description}
              />
              <div>
                <h4>min : {weatherData.daily[1].temp.min} °</h4>
                <h4>max : {weatherData.daily[1].temp.max} °</h4>
              </div>
            </div>
            <div>
              <h3>J + 2 : {weatherData.daily[2].weather[0].description}</h3>
              <img
                src={`https:openweathermap.org/img/wn/${weatherData.daily[2].weather[0].icon}@2x.png`}
                alt={weatherData.daily[2].weather[0].description}
              />
              <div>
                <h4>min : {weatherData.daily[2].temp.min} °</h4>
                <h4>max : {weatherData.daily[2].temp.max} °</h4>
              </div>
            </div>
            <div>
              <h3>J + 3 : {weatherData.daily[3].weather[0].description}</h3>
              <img
                src={`https:openweathermap.org/img/wn/${weatherData.daily[3].weather[0].icon}@2x.png`}
                alt={weatherData.daily[3].weather[0].description}
              />
              <div>
                <h4>min : {weatherData.daily[3].temp.min} °</h4>
                <h4>max : {weatherData.daily[3].temp.max} °</h4>
              </div>
            </div>
            <div>
              <h3>J + 4 : {weatherData.daily[4].weather[0].description}</h3>
              <img
                src={`https:openweathermap.org/img/wn/${weatherData.daily[4].weather[0].icon}@2x.png`}
                alt={weatherData.daily[4].weather[0].description}
              />
              <div>
                <h4>min : {weatherData.daily[4].temp.min} °</h4>
                <h4>max : {weatherData.daily[4].temp.max} °</h4>
              </div>
            </div>
            <div>
              <h3>J + 5 : {weatherData.daily[5].weather[0].description}</h3>
              <img
                src={`https:openweathermap.org/img/wn/${weatherData.daily[5].weather[0].icon}@2x.png`}
                alt={weatherData.daily[5].weather[0].description}
              />
              <div>
                <h4>min : {weatherData.daily[5].temp.min} °</h4>
                <h4>max : {weatherData.daily[5].temp.max} °</h4>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
};

export default CityPage;
