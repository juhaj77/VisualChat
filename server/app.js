const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const channelRouter = require('./routes/channelRouter')
const userRouter = require('./routes/userRouter')
const pictureRouter = require('./routes/pictureRouter')
const cors = require('cors')
require('express-async-errors')

app.use(express.static('build'))

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

app.use(cors())
app.use(bodyParser.json())
app.use('/api/users',userRouter)
app.use('/api/channels',channelRouter)
app.use('/api/pictures',pictureRouter)

module.exports = app