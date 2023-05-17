const Home = ({ citiesData }) => {
  console.log(citiesData);

  return (
    <div>
      <h1>Home</h1>
      <div>
        {citiesData.map((city) => (
          <h1
            key={
              city.geoCode.latitude !== undefined ||
              city.geoCode.longitude !== undefined
                ? `${city.geoCode.latitude}${city.geoCode.longitude}`
                : `${Math.random()}`
            }
          >
            {city.name}
          </h1>
        ))}
      </div>
    </div>
  );
};

export default Home;
