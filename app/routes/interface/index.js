var express = require('express');
var router = express.Router();
var jwt  = require('jsonwebtoken');

// Check auth
function isAuthenticated(req, res, next) {
  if (req.cookies.token != undefined ) {
      if(!isExpired(req.cookies.token))
        return next();
      else
        res.render('401');  // 401
  }
  else
    res.render('401'); // 401
}

function isExpired(token) {
  if (token && jwt.decode(token)) {
    const expiry = jwt.decode(token).exp;
    const now = new Date();
    return now.getTime() > expiry * 1000;
  }
  return false;
}

/* GET home page.*/
router.get('/',  isAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST logout */
router.post('/logout', isAuthenticated, (req, res) => {
  res.clearCookie('token'); // delete cookie
  return res.status(200).redirect('/auth/login');
});

module.exports = router;
