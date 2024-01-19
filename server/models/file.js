const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
  name: { type: String, required: true },
  details: String,
  file: { 
    data: Buffer,
    contentType: String,
    encoding: String
  },
  added_date:{
    type: Date,
    default: Date.now
  },
  top: { type: Number, required: true },
  left:  { type: Number, required: true }
})
fileSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('File', fileSchema)