import noteService from '../services/htmls'

export const initializeHtmls = (id, user) => async dispatch => {
  const htmls = await noteService.getHtmls(id, user)
  dispatch({
    type: 'INIT_HTMLS',
    data: htmls
  })
}

export const addHtml = (html, channel, user) => {
  return {
    type: 'ADD_HTML',
    data: { html, channel, token: user.token }
  }
}

export const setHtml = (html, channel, user) => {
  return {
    type: 'SET_HTML',
    data: { html, channel, token: user.token }
  }
}

export const initEmptyHtmls = () => ({ type: 'INIT_EMPTY' })

export const deleteHtml = (htmlID, channelID, user) => {
  return {
    type: 'DELETE_NOTE',
    data: { htmlID, channelID, token: user.token }
  }
}
const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_HTMLS':
    return action.data
  case 'SET_HTML': {
    const newHtml = action.data.html
    return state.map(n => (newHtml.id === n.id ? newHtml : n))
  }
  case 'SOCKET_ADD_HTML':
    return state.concat({...action.data})
  case 'SOCKET_SET_HTML':
    return state.map(n => (action.data.id === n.id ? action.data : n))
  case 'SOCKET_DELETE_HTML':
    return state.filter(n =>(n.id !== action.data))
  case 'INIT_EMPTY':
    return []
  default:
    return state
  }
}

export default reducer