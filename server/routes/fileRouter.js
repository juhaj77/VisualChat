const router = require('express').Router()
const multer  = require('multer')
const File = require('../models/file')
const Channel = require('../models/channel')
const authorize = require('../verifytoken.js')
require('express-async-errors')

const upload = multer({
  limits: { fileSize: 6000000 }
})

router.post('/add/:id',upload.single('uploaded_file'), async (request,response,next) => {
  
  const file = new File({
    file: { 
      data: request.file.buffer,
      contentType: request.file.mimetype,
      encoding: request.file.encoding
    },
    ...request.body
  })
  try {
    const newItem = await file.save()
    const channel = await Channel.findById(request.params.id)
    const files = channel.files.concat(newItem._id)
    await Channel.findByIdAndUpdate(request.params.id, {files:files})
    const newFile = newItem.toJSON()
    response.status(200).send({id: newFile.id, name: newFile.name, top:newFile.top, left:newFile.left})
  } catch (e) {
    console.log(e)
    next(new Error(e.message))
  }
})
router.get('/get/:id', authorize, async (request,response,next) => {
  const item = await File.findById(request.params.id)
      response.json(item.toJSON()) 
})
router.delete('/delete/:id', authorize, async (request,response,next) => {
  await File.deleteOne({_id:request.params.id})
        response.status(200).send()
})
module.exports = router