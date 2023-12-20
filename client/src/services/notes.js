import axios from 'axios'

const baseUrl = '/api/channels'

const getNotes = async (id, user) => {
  const notes = await axios.get(`${baseUrl}/${id}/notes`, { headers: {Authorization: user.token}})
  return notes.data
}
export default {getNotes}