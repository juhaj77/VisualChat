export const setConnectedUsers = data => dispatch => {
  dispatch ({
    type: 'SET_CONNECTED_USERS',
    data
  })
}

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'SET_CONNECTED_USERS':
    return action.data
  default:
    return state
  }
}
export default reducer