import React from 'react'
import ReactDOM from 'react-dom/client'
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
import fileService from './services/files'
import usersReducer from './reducers/usersReducer'
import noteReducer from './reducers/noteReducer'
import errorReducer from './reducers/errorReducer'
import gapiReducer from './reducers/gapiReducer'
import pictureReducer from './reducers/pictureReducer'
import fileReducer from './reducers/fileReducer'
import htmlReducer from './reducers/htmlReducer'
import connectedUsersReducer from './reducers/connectedUsersReducer'
import { GoogleOAuthProvider } from '@react-oauth/google'
import io from 'socket.io-client'

const createMySocketMiddleware = () => {
  return storeAPI => {
    //let socket = io('ws://localhost:3003')
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
    socket.on('add_html', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_ADD_HTML',
          data : data.html
        })
      }
    })
    socket.on('img_callback', async (data) => {
      if(storeAPI.getState().channel.id === data.id) {
      if(storeAPI.getState().loggedUser.token !== data.token){
        const pictures = await pictureService.getPictures(storeAPI.getState().channel.id, storeAPI.getState().loggedUser)
        storeAPI.dispatch({
          type: 'INIT_PICTURES',
          data: pictures
        })
      }
    }})
    socket.on('file_callback', async (data) => {
      if(storeAPI.getState().channel.id === data.id) {
      if(storeAPI.getState().loggedUser.token !== data.token){
        const files = await fileService.getFiles(storeAPI.getState().channel.id, storeAPI.getState().loggedUser)
        const visibleFiles = files.map(f => ({ ...f, show:true}))
        storeAPI.dispatch({
          type: 'INIT_FILES',
          data: visibleFiles
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
    socket.on('delete_file', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_DELETE_FILE',
          data : data.id
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
    socket.on('set_html', (data) => {
      if(storeAPI.getState().channel.id === data.channelID) {
        storeAPI.dispatch({
          type : 'SOCKET_SET_HTML',
          data : data.html
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
        action.type === 'IMG_CALLBACK' ||
        action.type === 'FILE_CALLBACK' ||
				action.type === 'DELETE_NOTE' ||
        action.type === 'DELETE_FILE' ||
				action.type === 'SET_USER' ||
				action.type === 'USER_LOGOUT' ||
        action.type === 'SET_HTML' ||
				action.type === 'ADD_HTML' ||
				action.type === 'SET_CHANNEL') {
					
        socket.emit('action',action)

        if(action.type === 'SEND_WEBSOCKET_MESSAGE' || 
          action.type === 'SET_NOTE' || 
          action.type === 'SET_USER' || 
          action.type === 'USER_LOGOUT' || 
          action.type === 'SET_CHANNEL')
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
  files: fileReducer,
  channel: selectedChannelReducer,
  users: usersReducer,
  htmls: htmlReducer,
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
const root = ReactDOM.createRoot(document.getElementById('root'));
const render = () => {
  root.render(
    <Provider store={store}>
      <GoogleOAuthProvider clientId="371216924606-rgdtfalqj9tklp61rkv27d9ii14cenbe.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  )
}

render()
store.subscribe(render)
