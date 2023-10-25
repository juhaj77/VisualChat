const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const channelRouter = require('./routes/channelRouter')
const userRouter = require('./routes/userRouter')
const pictureRouter = require('./routes/pictureRouter')
const config = require('./utils/config')
const cors = require('cors')
require('express-async-errors')
const session = require("express-session");
const passport = require("passport");

/*
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};
*/
app.use(session({ secret: "uyfkjytg65756e56e65r7wrthtr7657e6547uyrtyhdrtyh" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('build'))

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl, { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true })

//mongoose.connect(mongoUrl, { useNewUrlParser: true })
/*
var allowedOrigins = ['http://localhost:3000',
                      'https://accounts.google.com'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));*/
app.use(cors())
app.use(bodyParser.json())
/*app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.send('<a href="/google">Log in with Google</a>');
})
app.get("/google", passport.authenticate("google", { scope: ["email"] }), (req,res) => {
  res.set("Access-Control-Allow-Origin", "*")
})
app.get( "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);
app.get("/failure", (req, res) => {res.send("Something went wrong. Please try again")});
app.get("/success", isLoggedIn, (req, res) => {
  res.send(`
  ${req.user.displayName}
  You are able to access protected territory!`);
})
app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("You are now logged out!");
})*/
app.use('/api/users',userRouter)
app.use('/api/channels',channelRouter)
app.use('/api/pictures',pictureRouter)

module.exports = app