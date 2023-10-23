import messageService from '../services/messages'

/*eslint-disable eqeqeq*/

export const initializeMessages = (id, user) => async dispatch => {
  const msgs = await messageService.getMessages(id, user)
  await dispatch({
    type: 'INIT_MESSAGES',
    data: msgs
  })
}

export const newFeed = () => ({ type: 'NEW_FEED' })

export const addMsg = (message, user, channel) => dispatch => {
  const date = new Date()
  const msgByAuthor =`${user.username}:${new Date(date.getTime()-date.getTimezoneOffset()*60*1000).toISOString()};${message}`
  dispatch ({
    type: 'SEND_WEBSOCKET_MESSAGE',
    data: { message: msgByAuthor,
      channel, token: user.token }
  })
}

export const removeAnimation = () => ({type: 'REMOVE_ANIMATION'})

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_MESSAGES':
    return action.data
  case 'SOCKET_MESSAGE_RECEIVED': {
    const msgs = action.data.messages.slice()
    msgs[msgs.length-1] = `UUSIVIESTI:${msgs[msgs.length-1]}`
    return msgs
  }
  case 'SEND_WEBSOCKET_MESSAGE':
    return [...state,action.data.message]
  case 'REMOVE_ANIMATION':
    return state.map((m) => (m.split(':',1) == 'UUSIVIESTI' ? m.replace('UUSIVIESTI:', '') : m))
  case 'NEW_FEED':
    return []
  default:
    return state
  }
}

export default reducer