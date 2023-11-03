const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.Promise = global.Promise

const channelSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  messages: [String],
  users: [{type: mongoose.Schema.Types.ObjectId, ref:'user'}],
  notes: [{type: mongoose.Schema.Types.ObjectId, ref:'Note'}],
  pictures: [{type: mongoose.Schema.Types.ObjectId, ref:'Picture'}],
  htmls: [{type: mongoose.Schema.Types.ObjectId, ref:'HTML'}]
})
channelSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
channelSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' })
module.exports = mongoose.model('Channel', channelSchema)
