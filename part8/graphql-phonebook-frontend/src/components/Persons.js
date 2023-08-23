import { useState } from "react"
import { gql, useQuery } from "@apollo/client"

const FIND_PERSON = gql`
    query findPersonByname($nametoSearch: String!) {
        findPerson(name: $nametoSearch) {
            name
            phone
            id
            address {
                street
                city
            }
        }
    }
`
const Person = ({ person, onClose }) => {
    return (
        <div>
            <h2>{person.name}</h2>
            <div>
                {person.address.stret} {person.address.city}
            </div>
            <div>{person.phone}</div>
            <button onClick={onClose}>close</button>
        </div>
    )
}

const Persons = ({persons}) => {

    const [nametoSearch, setNameToSearch] = useState(null)
    const result = useQuery(FIND_PERSON, {
        variables: {nametoSearch},
        skip: !nametoSearch
    })
    if ( nametoSearch && result.data) {
        return (
            <Person person={result.data.findPerson} onClose={() => setNameToSearch(null)} />
        )
    }
    return (
        <div>
            <h2>Persons</h2>
            {persons.map(p =>
                <div key={p.name}>
                    {p.name} {p.phone}
                    <button onClick={() => setNameToSearch(p.name)}>show address</button>
                </div>
            )}
        </div>
    )
}

export default Persons