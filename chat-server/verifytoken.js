var jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const Oauth2 = 0
const verifyToken = (req, res, next) => {
  var token = req.headers['authorization'] || req.body.token
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' })
  if(Oauth2) { 
    const body = req.body

    const client = new OAuth2Client();
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      return payload
    }
    verify()
      .then(p => {
        req.userId = p.sub
        next()
      })
      .catch(e => {
        console.log(e)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
      });
    } else {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
        req.userId = decoded.id
        next()
      })
    }
}

module.exports = verifyToken