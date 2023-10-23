import noteService from '../services/notes'

export const initializeNotes = (id, user) => async dispatch => {
  const notes = await noteService.getNotes(id, user)
  dispatch({
    type: 'INIT_NOTES',
    data: notes
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
    return state.concat(action.data)
  case 'SOCKET_SET_NOTE':
    return state.map(n => (action.data.id === n.id ? action.data : n))
  case 'SOCKET_DELETE_NOTE':
    return state.filter(n => n.id !== action.data)
  case 'INIT_EMPTY':
    return []
  default:
    return state
  }
}

export default reducer