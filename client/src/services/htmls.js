import axios from 'axios'

const baseUrl = '/api/channels'

const getHtmls = async (id, user) => {
  const notes = await axios.get(`${baseUrl}/${id}/htmls`, { headers: {Authorization: user.token}})
  return notes.data
}
export default {getHtmls}