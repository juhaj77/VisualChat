export const setChannel = (id, name, user) => dispatch => {
  dispatch ({
    type: 'SET_CHANNEL',
    data: {id, name, user:user.username, token: user.token}
  })
}

const reducer = (state = '', action) => {
  switch (action.type) {
  case 'SET_CHANNEL':
    return action.data
  default:
    return state
  }
}
export default reducer