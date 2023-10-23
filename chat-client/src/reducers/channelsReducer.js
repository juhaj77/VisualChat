import channelsService from '../services/channels'

export const initializeChannels = user => async dispatch => {
  const data = await channelsService.getChannels(user)
  await dispatch({
    type: 'GET_CHANNELS',
    data
  })
}

export const createChannel = (name, users, user) => dispatch => {
  dispatch ({
    type: 'CREATE_CHANNEL',
    data: { name, users, token:user.token }
  })
}

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'GET_CHANNELS':
    return  action.data.data.channels
  case 'SOCKET_ADD_CHANNEL':
    return state.concat(action.data)
  default:
    return state
  }
}
export default reducer