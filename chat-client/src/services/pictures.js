import axios from 'axios'

const baseUrl = '/api/channels'

const getPictures = async (id, user) => {
  const pictures = await axios.get(`${baseUrl}/${id}/pictures`, { headers: {Authorization: user.token}})
  return pictures.data
}
export default {getPictures}