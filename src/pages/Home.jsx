import { Link } from "react-router-dom";

const Home = ({ citiesData }) => {
  console.log(citiesData);

  return (
    <div>
      <h1>Home</h1>
      <div>
        {citiesData.map((city) => (
          <button
            key={
              city.geoCode.latitude !== undefined ||
              city.geoCode.longitude !== undefined
                ? `${city.geoCode.latitude}${city.geoCode.longitude}`
                : `${Math.random()}`
            }
          >
            <Link to={`/city/${city.name.toLowerCase().replace(/\s/g, "")}`}>
              {city.name}
            </Link>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
