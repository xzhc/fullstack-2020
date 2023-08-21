import { useState } from "react"
import { Alert, Button, Form, Nav, Navbar, Table } from "react-bootstrap"
import { Routes, Route, Link, useNavigate, Navigate, useMatch } from "react-router-dom"


const Home = () => (
  <div> <h2>TKTL notes app</h2> </div>
)

const Note = ({note}) => {

  return (
    <div >
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

const Notes = ({notes}) => (
  <div> 
    <h2>Notes</h2>
    <Table striped>
    <tbody>
      {notes.map(note => 
        <tr key={note.id}>
          <td>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </td>
          <td>{note.user}</td>
        </tr>
      )}
    </tbody>
    </Table> 
    
  </div>
)

const Users = () => (
  <div> <h2>Users</h2> </div>
)


const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai')
    navigate('/')
  }
  return (
    <div>
      <h2>login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control type="text" name="username" />
          <Form.Label>password:</Form.Label>
          <Form.Control type="password" />
          <Button variant="primary" type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}



const App = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  
  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    },  10000);
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/notes/:id')
  const note = match ? notes.find(note => note.id === Number(match.params.id)) : null
  return (
    <div className="container">
        {(message && <Alert variant="success">{message}</Alert>)}
        <Navbar collapseOnSelect expand='lg' bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className = "me-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">home</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/notes">notes</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                {user ? <em style={padding}>{user} logged in </em> : <Link style={padding} to="/login">login</Link>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>  
        </Navbar>

        <Routes>
          <Route path="/notes/:id" element={<Note note={note}/>} />
          <Route path="/notes" element={<Notes notes={notes}/>} />
          <Route path="/users" element={user ? <Users /> : <Navigate replace to = '/login'/> } />
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/" element={<Home />} />
        </Routes>

        <div>
          <i>Note app, Department of Computer Science 2022</i>
        </div>
    </div>
  )
}


export default App;
