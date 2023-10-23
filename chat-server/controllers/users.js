const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AccessTokenHandler = require('node-accesstoken-validation').AccessTokenHandler;
const User = require('../models/user.js')
const {OAuth2Client} = require('google-auth-library');


const UserController = {
  getAll: async (request, response) => {
    const data = await User.find({})
    const users = data.map(ch => ch.toJSON())
    response.json({users: users}) 
  },
  registerUser:  async (request, response, next) => {
    try {
      const body = request.body
      if (body.username === undefined || body.password === undefined
				|| body.username.length < 3 || body.password.length < 3) {
        return response.status(400).json({ error: 'missing or invalid password or username' })
      }
      const saltRounds = 10
      const password = await bcrypt.hash(body.password, saltRounds)
      
      const user = new User({
        username: body.username,
        password
      })
      
      const savedUser = await user.save()
      
      response.json(savedUser.toJSON())
    } catch (exception) {
      if (exception.name === 'ValidationError') {
        return response.status(400).json({ error: 'dublicate username' })
      }
      next(exception)
    }
  },
  
  authenticateUser: async (request, response) => {
    console.log('0')
    const body = request.body
    if(body.idToken){
      const client = new OAuth2Client();
      async function verify() {
        console.log('A')
        const ticket = await client.verifyIdToken({
          idToken: body.idToken,
          audience: "371216924606-rgdtfalqj9tklp61rkv27d9ii14cenbe.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log('authenticateUser',payload.name,payload.exp)
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        return payload
      }
      verify()
        .then(async p => {
          let user = await User.findOne({ username: p.email.split('@')[0] })
          console.log(p,user)
          if(user === null) {
            user = new User({
              username: p.email.split('@')[0]
            })
            user = await user.save()
          }
          const userForToken = {
            username: user.username,
            id: user._id
          }
              
          const token = jwt.sign(userForToken, process.env.SECRET)
          response
          .status(200)
          .send({ token, username: user.username, userId: user._id })
        })
        .catch(e => {
          console.log(e)
          return response.status(401).json({
            error: e.message
          })
        });
    } else {
      console.log(body)
      const user = await User.findOne({ username: body.username })
      const passwordCorrect = user === null
        ? false
        : bcrypt.compare(body.password, user.password)
          
      if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
      }
        
      const userForToken = {
        username: user.username,
        id: user._id
      }
          
      const token = jwt.sign(userForToken, process.env.SECRET)
          
      response
        .status(200)
        .send({ token, username: user.username, userId: user._id })
    }

  }
}

module.exports = UserController