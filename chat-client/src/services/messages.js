import axios from 'axios'

const baseUrl = '/api/channels'

const getMessages = async (id, user) => {
  const msgs = await axios.get(`${baseUrl}/${id}`,{ headers: {Authorization: user.token}})
  return msgs.data
}
export default {getMessages}