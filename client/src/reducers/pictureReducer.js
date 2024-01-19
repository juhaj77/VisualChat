import pictureService from '../services/pictures'

export const initializePictures = (id, user) => async dispatch => {
  const pictures = await pictureService.getPictures(id, user)
  dispatch({
    type: 'INIT_PICTURES',
    data: pictures
  })
}
// id is channel id
export const addPicture = (file, id, user) => {
  return {
    type: 'ADD_PICTURE',
    data: { file, id, token: user.token }
  }
}
export const callback = (id, user) => {
  return {
    type: 'IMG_CALLBACK',
    data: { id, token: user.token }
  }
}
export const initEmptyPictures = () => ({ type: 'INIT_EMPTY' })

const pictureReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_PICTURES':
      return action.data
    case 'ADD_PICTURE': {
      return state.concat(action.data.file.data)
      }
    case 'INIT_EMPTY':
      return []
    case 'IMG_CALLBACK': 
      return state
    default:
    return state
    }
  }

  export default pictureReducer