export const setError = data => dispatch => {
  dispatch ({
    type: 'SET_ERROR',
    data
  })
}

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_ERROR':
    return action.data
  default:
    return state
  }
}
export default reducer