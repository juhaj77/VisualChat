const mongoose = require('mongoose')

const pictureSchema = mongoose.Schema({
  name: { type: String, required: true },
  details: String,
  picture: { 
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
pictureSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Picture', pictureSchema)