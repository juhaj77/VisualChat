import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import messageReducer from './reducers/messageReducer'
import loggedUserReducer from './reducers/loggedUserReducer'
import channelsReducer from './reducers/channelsReducer'
import selectedChannelReducer from './reducers/selectedChannelReducer'
import pictureService from './services/pictures'
import usersReducer from './reducers/usersReducer'
import noteReducer from './reducers/noteReducer'
import errorReducer from './reducers/errorReducer'
import gapiReducer from './reducers/gapiReducer'
import pictureReducer, { initializePictures } from './reducers/pictureReducer'
import connectedUsersReducer from './reducers/connectedUsersReducer'
import io from 'socket.io-client'

const createMySocketMiddleware = () => {
  return storeAPI => {
   // let socket = io('ws://localhost:3003')
    let socket = io('wss://visualchat.onrender.com')
		
    socket.on('message', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_MESSAGE_RECEIVED',
          data : { channel: data.channelID, messages: data.messages }
        })
      }
    })
    socket.on('add_note', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_ADD_NOTE',
          data : data.note
        })
      }
    })
    socket.on('callback', async (data) => {
      if(storeAPI.getState().channel.id === data.id) {
      if(storeAPI.getState().loggedUser.token !== data.token){
        const pictures = await pictureService.getPictures(storeAPI.getState().channel.id, storeAPI.getState().loggedUser)
        storeAPI.dispatch({
          type: 'INIT_PICTURES',
          data: pictures
        })
      }
       
    }})
    socket.on('delete_note', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_DELETE_NOTE',
          data : data.noteID
        })
      }
    })
    socket.on('set_note', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_SET_NOTE',
          data : data.note
        })
      }
    })
    socket.on('myError', (data) => {
      storeAPI.dispatch({
        type : 'SET_ERROR',
        data
      })
    })
    socket.on('channel', data => {
      if(data.users.find(u => u === storeAPI.getState().loggedUser.userId)){
        storeAPI.dispatch({
          type: 'SOCKET_ADD_CHANNEL',
          data
        })
      }
    })
    socket.on('set_connected_users', data => {
      storeAPI.dispatch({
        type: 'SET_CONNECTED_USERS',
        data
      })
    })
    socket.on('reconnect', () => {
      if(storeAPI.getState().loggedUser) socket.emit('action',{type: 'SET_USER',
        data:storeAPI.getState().loggedUser})
      if(storeAPI.getState().channel) socket.emit('action',{type: 'SET_CHANNEL',
        data:{user:storeAPI.getState().loggedUser.username,
          name:storeAPI.getState().channel.name,
          token: storeAPI.getState().loggedUser.token}})
    })

    return next => action => {
      if( action.type === 'SEND_WEBSOCKET_MESSAGE' ||
				action.type === 'CREATE_CHANNEL' ||
				action.type === 'ADD_NOTE' ||
				action.type === 'SET_NOTE' ||
        action.type === 'CALLBACK' ||
				action.type === 'DELETE_NOTE' ||
				action.type === 'SET_USER' ||
				action.type === 'USER_LOGOUT' ||
				action.type === 'SET_CHANNEL') {
					
        socket.emit('action',action)

        if(action.type === 'SEND_WEBSOCKET_MESSAGE' || action.type === 'SET_NOTE' || action.type === 'SET_USER' || action.type === 'USER_LOGOUT' || action.type === 'SET_CHANNEL')
          return next(action)
        else return
      }
      return next(action)
    }
  }
}


const reducer = combineReducers({
  messages: messageReducer,
  loggedUser: loggedUserReducer,
  channels: channelsReducer,
  gapi: gapiReducer,
  pictures: pictureReducer,
  channel: selectedChannelReducer,
  users: usersReducer,
  notes: noteReducer,
  error: errorReducer,
  connectedUsers: connectedUsersReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') state = undefined
  return reducer(state, action)
}

const store = createStore(rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk,createMySocketMiddleware())
  )
)

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
