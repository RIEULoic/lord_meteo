import { Link } from "react-router-dom";

const LocalStorageDisplay = () => {
  const citiesSavedOnLocalStorage = [];
  for (let i = 1; i <= localStorage.length; i++) {
    citiesSavedOnLocalStorage.push(JSON.parse(localStorage.getItem(i)));
  }

  return (
    <>
      <h1>Précédentes recherches : </h1>
      <div>
        {citiesSavedOnLocalStorage.map((city) => {
          console.log(city.cityIndex);
          return (
            <>
              <button key={city.cityIndex}>
                <Link
                  to={`/city/${city.name.toLowerCase().replace(/\s/g, "")}`}
                >
                  <h1>{city.name}</h1>
                </Link>
              </button>
            </>
          );
        })}
      </div>
    </>
  );
};

export default LocalStorageDisplay;
