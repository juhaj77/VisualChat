const router = require('express').Router()
const multer  = require('multer')
const Picture = require('../models/picture')
const Channel = require('../models/channel')

const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(_req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //allowed file extensions
      return cb(new Error('please upload png,jpeg or jpg'))
    }
    cb(undefined, true)
  }
})

router.post('/add/:id',upload.single('uploaded_file'), async (request,response,next) => {
  console.log(request.file)
  console.log('params:', request.params)
  console.log('body:', request.body)
  
  const picture = new Picture({
    picture: { 
      data: request.file.buffer,
      contentType: request.file.mimetype,
      encoding: request.file.encoding
    },
    ...request.body
  })
  try {
    const newItem = await picture.save()
    const channel = await Channel.findById(request.params.id)
    const pictures = channel.pictures.concat(newItem._id)
    await Channel.findByIdAndUpdate(request.params.id, {pictures:pictures})
    console.log(newItem)
    response.status(200).send(newItem.toJSON())
  } catch (e) {
    
    console.log(e)
    next(new Error(e.message))
  }
})

module.exports  = router