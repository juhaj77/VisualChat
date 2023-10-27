import axios from 'axios'
const baseUrl = '/api/users'

const login = async credentials => {
  
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials)
    return response.data
  } catch (e) {
    return null
  }
}

export default { login }