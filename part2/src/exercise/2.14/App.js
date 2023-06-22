import { useState, useEffect } from "react";
import axios from "axios";
const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null)
  const [weatherError, setWeatherError] = useState(null)
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  useEffect(() =>{
    if ( selectedCountry) {
      const capital = selectedCountry.capital[0]
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=5&appid=${api_key}`;
      axios.get(url)
      .then(response => {
        setWeatherData(response.data)
        setWeatherError(null)
      })
      .catch(error => {
        setWeatherData(null)
        setWeatherError('Could not retrieve weather data for selected country')
      })
    }
  },[selectedCountry, api_key]);

  const handleSearchChange = event => {
    setSearch(event.target.value);
    setSelectedCountry(null);
  }

  const handleShowCountryClick = country => {
    setSelectedCountry(country);
  }

  const matchedCountries = search ? countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())) : countries;
  const tooManyResults = matchedCountries.length > 10;

  const viewToRender = () => {
    if (selectedCountry) {
      const country = selectedCountry;
      return (
        <div key={country.name.common}>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>
          <p>Region: {country.region}</p>
          <p>Population: {country.population}</p>
          <img src={country.flags.svg} alt={country.name.common} width="200" />
          {weatherError ? (<p>{weatherError}</p>): weatherData ? (<p>{weatherData.main.temp}°C</p>):(
            <p>Loading weather data...</p>
          )}
        </div>
      );
    } else if (tooManyResults) {
        return <div>Too many matches, specify another filter</div>;
    } else {
      return matchedCountries.map(country => (
        <div key={country.name.common}>
          <h2>{country.name.common}</h2>
          <button onClick={() => handleShowCountryClick(country)}>Show</button>
        </div>
      ));
    }
  }

  return (
    <div>
      <div>find countries <input value={search} onChange={handleSearchChange}/></div>
      {viewToRender()}
    </div>
  )
}

export default App;
