import noteService from '../services/notes'

export const initializeNotes = (id, user) => async dispatch => {
  const notes = await noteService.getNotes(id, user)
  // for deleteNote animation. The note must exist to be animated.
  // Note is deleted on server, but only hided on client side.
  const notesVisible = notes.map(n => ({ ...n, show:true}))
  dispatch({
    type: 'INIT_NOTES',
    data: notesVisible
  })
}

export const addNote = (note, channel, user) => {
  return {
    type: 'ADD_NOTE',
    data: { note, channel, token: user.token }
  }
}

export const setNote = (note, channel, user) => {
  return {
    type: 'SET_NOTE',
    data: { note, channel, token: user.token }
  }
}

export const initEmpty = () => ({ type: 'INIT_EMPTY' })

export const deleteNote = (noteID, channelID, user) => {
  return {
    type: 'DELETE_NOTE',
    data: { noteID, channelID, token: user.token }
  }
}
const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_NOTES':
    return action.data
  case 'SET_NOTE': {
    const newNote = action.data.note
    return state.map(n => (newNote.id === n.id ? newNote : n))
  }
  case 'SOCKET_ADD_NOTE':
    return state.concat({...action.data, show:true})
  case 'SOCKET_SET_NOTE':
    return state.map(n => (action.data.id === n.id ? action.data : n))
  case 'SOCKET_DELETE_NOTE':
    return state.map(n =>(n.id === action.data ? { ...n, show:false} : n))
  case 'INIT_EMPTY':
    return []
  default:
    return state
  }
}

export default reducer