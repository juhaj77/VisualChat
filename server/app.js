const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const channelRouter = require('./routes/channelRouter')
const userRouter = require('./routes/userRouter')
const pictureRouter = require('./routes/pictureRouter')
const fileRouter = require('./routes/fileRouter')
const cors = require('cors')
require('express-async-errors')

app.use(express.static('build'))

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

const errorHandling = (err, req, res, next) => {
    res.status(500).json({
      msg: err.message,
      success: false,
    })
  }

app.use(cors())
app.use(bodyParser.json())
app.use('/api/users',userRouter)
app.use('/api/channels',channelRouter)
app.use('/api/pictures',pictureRouter)
app.use('/api/files',fileRouter)

app.use(errorHandling)

module.exports = app