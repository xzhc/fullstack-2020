import axios from 'axios'

//设置后端服务的基本URL
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

//定义获取所有笔记的函数
const getAll = () => {
  const request = axios.get(baseUrl)

  return request.then(response => response.data)
}

//定义创建新笔记的函数
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

//定义更新指定笔记的函数
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
  getAll,
  create,
  update,
  setToken
}