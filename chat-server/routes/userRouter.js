const router = require('express').Router()
const users = require('../controllers/users')
const authorize = require('../verifytoken.js')


router.get('/',authorize, users.getAll)

router.post('/signup', users.registerUser)

router.post('/login', users.authenticateUser)

module.exports = router