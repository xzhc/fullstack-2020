import axios from 'axios'
const baseUrl = '/api/blogs'

// eslint-disable-next-line no-unused-vars
let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}



const getAll = () => {
  const config = {
    headers: { Authorization: token}
  }
  

  const request = axios.get(baseUrl, config)

  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token}
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create }