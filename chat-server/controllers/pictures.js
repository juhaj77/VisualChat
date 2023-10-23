const Picture = require('../models/picture')
const Channel = require('../models/channel')
require('express-async-errors')

const pictureController = {
    add: async (request, response) => {
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
        const newItem = await picture.save()
        const channel = await Channel.findById(request.params.channelId)
        const pictures = channel.pictures.concat(newItem._id)
        await Channel.findByIdAndUpdate(request.params.channelId, {pictures:pictures})
        console.log(newItem)
        response.status(200).send(newItem.toJSON().id)
      }
}
module.export = pictureController