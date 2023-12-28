import usersService from '../services/users'

export const initializeUsers = user => async dispatch => {
  const data = await usersService.getUsers(user)
  dispatch({
    type: 'GET_USERS',
    data
  })
}


export const signUp = userdata => async dispatch => {
  const data = await usersService.addUser(userdata)
  if(data.error) throw Error(data.error)
  dispatch({
    type: 'ADD_USER',
    data
  })
}


const reducer = (state = [], action) => {
  switch (action.type) {
  case 'GET_USERS':
    return  action.data.data.users
  case 'ADD_USER':
    return [...state, action.data]
  default:
    return state
  }
}
export default reducer