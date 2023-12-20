import axios from 'axios'

const baseUrl = '/api/channels'

const getChannels = async (user) => {
   return await axios.get(`${baseUrl}/user/${user.userId}`,{ headers: {Authorization: user.token}})
}
export default {getChannels}