const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const channelRouter = require('./routes/channelRouter')
const userRouter = require('./routes/userRouter')
const pictureRouter = require('./routes/pictureRouter')
const config = require('./utils/config')
const cors = require('cors')
require('express-async-errors')
const session = require("express-session");
const passport = require("passport");

app.use(session({ secret: "uyfkjytg65756e56e65r7wrthtr7657e6547uyrtyhdrtyh" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('build'))

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl, { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true })

app.use(cors())
app.use(bodyParser.json())
app.use('/api/users',userRouter)
app.use('/api/channels',channelRouter)
app.use('/api/pictures',pictureRouter)

module.exports = app