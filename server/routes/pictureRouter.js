const router = require('express').Router()
const multer  = require('multer')
const File = require('../models/file')
const Channel = require('../models/channel')
const authorize = require('../verifytoken.js')
require('express-async-errors')

const upload = multer({
  limits: { fileSize: 4000000 },
  fileFilter(_req, file, cb) {
    if (!file.originalname.match(/\.(JPG|jpg|jpeg|png)$/)) { //allowed file extensions
      return cb(new Error('please upload png,jpeg or jpg'))
    }
    cb(undefined, true)
  }
})

router.post('/add/:id',
  [authorize, upload.single('uploaded_file')], 
  async (request,response,next) => {
  
  const picture = new File({
    file: { 
      data: request.file.buffer,
      contentType: request.file.mimetype,
      encoding: request.file.encoding
    },
    ...request.body
  })

    const newItem = await picture.save()
    const channel = await Channel.findById(request.params.id)
    const pictures = channel.pictures.concat(newItem._id)
    await Channel.findByIdAndUpdate(request.params.id, {pictures:pictures})
    response.status(200).send(newItem.toJSON())

})

module.exports  = router