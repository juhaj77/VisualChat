import pictureService from '../services/pictures'

export const initializePictures = (id, user) => async dispatch => {
  console.log('\ninitializePictures user:',user)
  const pictures = await pictureService.getPictures(id, user)
  dispatch({
    type: 'INIT_PICTURES',
    data: pictures
  })
}
// id is channel id
export const addPicture = (picture, id, user) => {
  console.log('\npicture',picture,'\nID',id,'\nUSER',user)
  return {
    type: 'ADD_PICTURE',
    data: { picture, id, token: user.token }
  }
}
export const callback = (id, user) => {
  console.log('\nID',id,'\nUSER',user)
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
      console.log('\nreducer state:',state,'\nAction:',action.data)
      return state.concat(action.data.picture.data)
      }
    case 'CALLBACK': 
      return state
    default:
    return state
    }
  }

  export default pictureReducer