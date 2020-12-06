var express = require('express');
var router = express.Router();
var jwt  = require('jsonwebtoken');
var User = require('../../controllers/user')
var sha1 = require('sha1');


router.post('/login', (req, res) => {
    var data      = req.body; // Get data from ajax
    
    User.lookUp(data).then(user => {
        console.log(user)
        if(user){
            var token = jwt.sign({
                user: data.email,
                role: data.role,
              }, 
              process.env.JWT_SECRET_KEY, 
              { expiresIn: process.env.JWT_SECRET_TIME});
              
              req.headers.authorization = token;
              res.cookie('token', token, {
                sameSite: 'Strict'
              });
              //res.redirect('/feed');
              res.send(JSON.stringify(user))
        }
        else
          res.send("erro")

        
    });
  });


module.exports = router;
