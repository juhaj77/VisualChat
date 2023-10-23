const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise

const userScheema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: false }
})
//channels: [{type: mongoose.Schema.Types.ObjectId, ref:'Channel'}]
userScheema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

userScheema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })
const User = mongoose.model('User', userScheema)

module.exports = User