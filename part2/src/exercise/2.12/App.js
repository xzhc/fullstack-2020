import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries]  = useState([])
  const [search , setSearch] = useState('')

  useEffect(() =>{
    axios.get('https://restcountries.com/v3.1/all')
    .then(response =>{
      setCountries(response.data)
    })
  },[])

  const handleSearchChange = event =>{
    setSearch(event.target.value)
  }
  const matchedCountries = search ? countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())) : countries
  const handleShowCountryClick = countrieName => {
    setSearch(countrieName)
  } 
  const tooManyResults = matchedCountries.length > 10
  return (
    <div>
      <div>find countries <input value={search} onChange={handleSearchChange}/></div>
      {tooManyResults ?<div>Too many matches, specify another filter</div> :
        matchedCountries.map(country => (
          <div key={country.name.common}>
            <h2>{country.name.common}</h2>
            <p>capial:{country.capital}</p>
            <p>area:{country.area}</p>
            <p>Region: {country.region}</p>
            <p>Population: {country.population}</p>
            <img src={country.flags.svg} alt={country.name.common} width="200" />
          </div> 
        ))
      }
    </div>
  )
}

  
export default App;
