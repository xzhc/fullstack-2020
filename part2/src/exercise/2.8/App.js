import { useState, React } from "react"
const App = () => {
  const [persons,setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const handleSubmit = (event) =>{
    event.preventDefault()
    const person = {name: newName, number: newNumber}
    const nameExits = persons.some((person) => person.name === newName)
    const numberExits = persons.some((person) => person.number === newNumber)
    if ( !nameExits && !numberExits) {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
      setErrorMessage('')  
    } else if(nameExits){
      alert(newName + ' is already added to phonebook')
    } else if(numberExits){
      alert(newNumber + 'is already added to phonebook')
    }
  }
  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number:<input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      
      <ul>
        {persons.map((person) =>(
          <li key={person.name}>{person.name} - {person.number}</li>
        ))}
      </ul>
    </div>
  ) 
}

export default App;
