import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})
  const [message, setMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => {
        setBlogs(blogs);
      });
    }
  }, [user])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage('login successed!')
      setUsername('')
      setPassword('')
     
    } catch ( exception) {
      setMessage('error' + exception.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleAddBlog = async(event) => {
    event.preventDefault()
    try{
        const createdBlog = await blogService.create(newBlog)
        setBlogs([...blogs, createdBlog])
        setNewBlog({title: '', author: '', url: ''})//清空表单数据
        setMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
      } catch (exception) {
        setMessage('error' + exception.response.data.error)
      }   
  }

  const handleLogOut = () => {
    window.localStorage.clear()
    setUser(null)
    
  }


//登录表单
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
      username
        <input type='text'
             value={username}
             name='Username'
             onChange={ ({ target }) => setUsername(target.value)}
        />
      </div>  
      <div>
        password
        <input type='password'
             value={password}
             name='password'
             onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
    
  )

  //create blog 表单
  const createBlogForm = () => (
    <form onSubmit={handleAddBlog}>
      <div>
        title
        <input type='text'
              value={newBlog.title}
              onChange={({target}) => setNewBlog({ ...newBlog, title: target.value })}
        />
      </div>
      <div>
        author
      <input type='text'
              value={newBlog.author}
              onChange={({target}) => setNewBlog({ ...newBlog, author: target.value })}
        />
      </div>
      <div>
        url
      <input type='text'
              value={newBlog.url}
              onChange={({target}) => setNewBlog({ ...newBlog, url: target.value })}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} />
      {!user && loginForm()}
      {user && 
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogOut}>logout</button>
      </div>}
      {user && (
        <div>
          <h2>blogs</h2>
          {blogs.map(blog => (<Blog key={blog.id} blog={blog}/>))}
        </div>
      )}
      {user && createBlogForm()}
      
    </div>
  )
}

export default App