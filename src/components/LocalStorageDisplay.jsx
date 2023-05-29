import { Link } from "react-router-dom";

const LocalStorageDisplay = () => {
  const citiesSavedOnLocalStorage = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    //console.log(key);
    citiesSavedOnLocalStorage.push(JSON.parse(localStorage.getItem(key)));
    console.log(citiesSavedOnLocalStorage);
  }

  return (
    <>
      <h1>Précédentes recherches : </h1>
      <div>
        {citiesSavedOnLocalStorage.map((city) => {
          console.log(city.timestamp);
          return (
            <button key={city.timestamp}>
              <Link to={`/city/${city.name.toLowerCase().replace(/\s/g, "")}`}>
                <h1>{city.name}</h1>
              </Link>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default LocalStorageDisplay;
