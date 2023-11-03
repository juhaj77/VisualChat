const Channel = require('../models/channel')

const channelController = {
  getMessages: async (request, response) => {
    const channel = await Channel.findById(request.params.id)
    response.json(channel.messages) 

  },
  getNotes: async (request, response) => {
    const channel = await Channel.findById(request.params.id).populate('notes')
    const chs = channel.notes.map(ch => ch.toJSON())
    response.json(chs) 
  },
  getChannels: async (request, response) => {
    const data = await Channel.find({users:{$in:[request.params.id]}})
    const channels = data.map(ch => ch.toJSON())
    response.json({channels: channels}) 
  },
  getPictures: async (request, response) => {
    const channel = await Channel.findById(request.params.id).populate('pictures')
    const chs = channel.pictures.map(ch => ch.toJSON())
    response.json(chs) 
  },
  getHtmls: async (request, response) => {
    const channel = await Channel.findById(request.params.id).populate('htmls')
    const chs = channel.htmls.map(ch => ch.toJSON())
    response.json(chs) 
  },
}
module.exports = channelController