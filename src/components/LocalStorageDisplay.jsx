import { Link } from "react-router-dom";
import Button from "./Button";
import "./LocalStorageDisplay.css";

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
      {citiesSavedOnLocalStorage.length > 0 ? (
        <div>
          <h1 id="title">Précédentes recherches</h1>
          {citiesSavedOnLocalStorage.map((city) => {
            console.log(city.timestamp);
            return (
              <Link
                key={city.timestamp}
                to={`/city/${city.name.toLowerCase().replace(/\s/g, "")}`}
              >
                <Button>
                  <h1>{city.name}</h1>
                </Button>
              </Link>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default LocalStorageDisplay;
