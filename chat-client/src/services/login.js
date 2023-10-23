import axios from 'axios'
const baseUrl = '/api/users'

const login = async credentials => {
  
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials)
    return response.data
  } catch (e) {
    return null
  }/*
  try {
    const response = await axios.get(`/google`)
    console.log(response)
    return response
  } catch (e) {
    console.log(e)
    return null
  }*/
}

export default { login }