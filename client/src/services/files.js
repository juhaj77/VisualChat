import axios from 'axios'

const baseUrl = '/api/channels'

const getFiles = async (id, user) => {
  const files = await axios.get(`${baseUrl}/${id}/files`, { headers: {Authorization: user.token}})
  return files.data
}
export default {getFiles}