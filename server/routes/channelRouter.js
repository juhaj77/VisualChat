const router = require('express').Router()
const channels = require('../controllers/channels')
const authorize = require('../verifytoken.js')

router.get('/:id',authorize, channels.getMessages)

router.get('/:id/notes', authorize, channels.getNotes)

router.get('/:id/htmls', authorize, channels.getHtmls)

router.get('/:id/pictures', authorize, channels.getPictures)

router.get('/user/:id', authorize, channels.getChannels)

module.exports = router