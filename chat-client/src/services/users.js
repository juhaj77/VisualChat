import axios from 'axios'

const baseUrl = '/api/users'

const getUsers = async (user) => {
  console.log(user)  
  return await axios.get(`${baseUrl}`, { headers: {Authorization: user.token}})
}
const addUser = async (data) => {
  let newData = null
  try {
    newData = await axios.post(`${baseUrl}/signup`, data)
    return newData.data
  } catch (exception) {
    return newData
  }
}
export default { getUsers, addUser }