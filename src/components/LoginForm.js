import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event) => {
    setUserName(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)
    setUserName('')
    setPassword('')
  }
  return (
    <form onSubmit={handleSubmit}>
      {/* 输入用户名和密码 */}
      <div>
              username
        <input type="text" value={username} name="Username" onChange={ handleUsernameChange}
        />
      </div>
      <div>
              password
        <input type="password" value={password} name="Password" onChange={ handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm