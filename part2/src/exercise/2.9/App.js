import { useState, React } from "react"
const App = () => {
  const [persons,setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
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
      setSearchTerm('')  
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
  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <input value={searchTerm} onChange={handleSearchTerm}/></div>
      <form onSubmit={handleSubmit}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number:<input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) =>(
          <li key={person.name}>{person.name} - {person.number}</li>
        ))}
      </ul>
    </div>
  ) 
}

export default App;
