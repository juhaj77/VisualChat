export const setGapi = data => dispatch => {
    dispatch ({
      type: 'SET_GAPI',
      data
    })
  }
  
  const reducer = (state = null, action) => {
    switch (action.type) {
    case 'SET_GAPI':
      return action.data
    default:
      return state
    }
  }
  export default reducer