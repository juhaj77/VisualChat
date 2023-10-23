import pictureService from '../services/pictures'

export const initializePictures = (id, user) => async dispatch => {
  const pictures = await pictureService.getPictures(id, user)
  dispatch({
    type: 'INIT_PICTURES',
    data: pictures
  })
}
// id is channel id
export const addPicture = (picture, id, user) => {
  return {
    type: 'ADD_PICTURE',
    data: { picture, id, token: user.token }
  }
}
export const callback = (id, user) => {
  return {
    type: 'CALLBACK',
    data: { id, token: user.token }
  }
}

const pictureReducer = (state = [], action) => {
    switch (action.type) {
    case 'INIT_PICTURES':
      return action.data
    case 'ADD_PICTURE': {
      return state.concat(action.data.picture.data)
      }
    case 'CALLBACK': 
      return state
    default:
    return state
    }
  }

  export default pictureReducer