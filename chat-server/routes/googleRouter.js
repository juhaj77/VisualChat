const router = require('express').Router()
const passport = require("passport");
require("../auth");

router.route('/google').post((req, res, next) =>{

        passport.authenticate('digest', (err, user, info) => {

            if(err) return console.log(err);

            if(!user){
                res.set('WWW-Authenticate', 'x'+info);
                return res.send(401);
            }

            req.login(user, (err) => {
                if(err) return console.log(err);
                res.redirect('/admin/');
            });
        })(req, res, next);
    });