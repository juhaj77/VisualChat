const config = require('./utils/config')
const app = require('./app')
const http = require('http')
const Channel = require('./models/channel')
const Note = require('./models/note')
const Html = require('./models/html')
var jwt = require('jsonwebtoken')

const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,})
const users = new Map()
let token = false

io.on('connection', async socket => {
  socket.on('disconnect', () => {
    users.delete(socket.id)
    io.emit('set_connected_users', Array.from(users.values()))
  })
  socket.on('action', async action => {
    try {
        jwt.verify(action.data.token, process.env.SECRET,  (err) => {
        token = true
        if (err) {
          console.log('auth err:', action)
          token = false
        }
      })
      if(!token) return
      switch (action.type) {
      case 'SEND_WEBSOCKET_MESSAGE': {
        const channel = await Channel.findById(action.data.channel)
        const updatedMsgs = channel.messages.concat(action.data.message)
        await Channel.findByIdAndUpdate(action.data.channel, {messages:updatedMsgs})
        socket.broadcast.emit('message',{channelID: action.data.channel, messages: updatedMsgs}) 
        return
      }
      case 'CREATE_CHANNEL':{
        try {
          const newChannel = new Channel({
            name: action.data.name,
            users: action.data.users
          })
          const result = await newChannel.save()
          io.emit('channel', {id: result._id,users: result.users, messages:[],name: result.name})
        }  catch (exception) {
          if (exception.name === 'ValidationError') {
            socket.emit('myError', {message: 'the channel name is already in use'})
          }
        }
        return
      }
      case 'ADD_NOTE': {
        const newNote = new Note({...action.data.note, content: ''})
        const result = await newNote.save()
        const channel = await Channel.findById(action.data.channel)
        const notes = channel.notes.concat(result._id)
        await Channel.findByIdAndUpdate(action.data.channel, {notes:notes})
        io.emit('add_note', {channelID: action.data.channel, note:newNote.toJSON()})
        return
      }
      case 'SET_NOTE': {
        const note = action.data.note
        await Note.findByIdAndUpdate(note.id, {...note})
        socket.broadcast.emit('set_note', {channelID: action.data.channel, note: note})
        return
      }
      case 'ADD_HTML': {
        const newHtml = new Html({...action.data.html})
        const result = await newHtml.save()
        const channel = await Channel.findById(action.data.channel)
        const htmls = channel.htmls.concat(result._id)
        await Channel.findByIdAndUpdate(action.data.channel, {htmls:htmls})
        io.emit('add_html', {channelID: action.data.channel, html:newHtml.toJSON()})
        return
      }
      case 'SET_HTML': {
        const html = action.data.html
        await Html.findByIdAndUpdate(html.id, {...html})
        socket.broadcast.emit('set_html', {channelID: action.data.channel, html: html})
        return
      }
      case 'DELETE_NOTE': {
        const channel = await Channel.findById(action.data.channelID)
        const updatedNotes = channel.notes.filter(n => n != action.data.noteID)
        await Channel.findByIdAndUpdate(action.data.channelID, {notes: updatedNotes})
        await Note.deleteOne({_id: action.data.noteID})
        io.emit('delete_note', { ...action.data})
        return
      }
      case 'SET_USER': {
        if(!users.has(socket.id)) users.set(socket.id,action.data.username)
        io.emit('set_connected_users', Array.from(users.values()))
        return
      }
      case 'CALLBACK': {
        io.emit('callback',action.data)
        return
      }
      case 'USER_LOGOUT': {
        users.delete(socket.id)
        io.emit('set_connected_users', Array.from(users.values()))
        return
      }
      case 'SET_CHANNEL': {
        users.set(socket.id,`${action.data.user} - ${action.data.name}`)
        io.emit('set_connected_users', Array.from(users.values()))
        return
      }
      }
    } catch (exception) {
      console.log(exception)
    }
  })
}) 
const port = process.env.PORT || "8080"
server.listen(port)