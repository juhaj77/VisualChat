import loginService from '../services/login'

export const setUser = gredentials => async dispatch => {
  console.log(gredentials)
  const data = await loginService.login(gredentials)
  if(!data) throw Error('invalid username or password')
  window.localStorage.setItem(
    'loggedChatUser', JSON.stringify(data)
  )
  await dispatch({
    type: 'SET_USER',
    data
  })
}

export const clearUser = (data) => {
  window.localStorage.removeItem('loggedChatUser')
  return { type: 'USER_LOGOUT', data }
}

export const resetUser = data => ({ type:'SET_USER', data })

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return  action.data
  case 'USER_LOGOUT':
    return null
  default:
    return state
  }
}
export default reducer