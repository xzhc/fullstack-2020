import { useState, React } from "react"
import PersonForm from "./components/PersonForm"
import SearchFilter from "./components/SearchFilter"
import Persons from "./components/Persons"
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
      <SearchFilter searchTerm={searchTerm} handleSearchTerm={handleSearchTerm}/>
      <h3>Add a new</h3>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  ) 
}

export default App;
