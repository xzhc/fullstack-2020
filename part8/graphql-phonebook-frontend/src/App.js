import { gql, useQuery} from "@apollo/client"
import Persons from "./components/Persons"

const All_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }`

const App = () => {
  const result = useQuery(All_PERSONS)
  if ( result.loading) {
    return <div>loading...</div>
  }
  return (
    <Persons persons={result.data.allPersons} />
  )
}
export default App;
