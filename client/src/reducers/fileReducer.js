import fileService from '../services/files'

export const initializeFiles = (id, user) => async dispatch => {
  const files = await fileService.getFiles(id, user)
  const filesVisible = files.map(n => ({ ...n, show:true}))
  dispatch({
    type: 'INIT_FILES',
    data: filesVisible
  })
}
// id is channel id
export const addFile = (file, id, user) => {
  return {
    type: 'ADD_FILE',
    data: { file, id, token: user.token }
  }
}
export const deleteFile = (id, channelID, user) => {
  return {
    type: 'DELETE_FILE',
    data: { id , channelID, token: user.token }
  }
}
export const callback = (id, user) => {
  return {
    type: 'FILE_CALLBACK',
    data: { id, token: user.token }
  }
}
export const initEmptyFiles = () => {
  return ({ type: 'INIT_EMPTY' })
}

const fileReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_FILES': {
      return action.data
    }
    case 'ADD_FILE': {
      return state.concat({ ...action.data.file, show: true})
      }
    case 'SOCKET_DELETE_FILE':
      return state.map(n =>(n.id === action.data ? { ...n, show:false} : n))
    case 'INIT_EMPTY':
      return []
    case 'FILE_CALLBACK': 
      return state
    default:
    return state
    }
  }

  export default fileReducer