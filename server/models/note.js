const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  content: String,
  top: Number,
  left: Number,
  backgroundColor: String,
  author: String,
  date: Date
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Note', noteSchema)