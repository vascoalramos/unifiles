var express = require('express');
var router = express.Router();
var jwt  = require('jsonwebtoken');

//check auth
function isAuthenticated(req, res, next) {
  if (req.cookies.token != undefined ){
      if(!isExpired(req.cookies.token))
        return next();
      else
        res.render('ERRORPAGE');  //nao existe
  }
  else
    res.render('ERRORPAGE');//nao existe
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
router.get('/',  function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//clear cookie aqui ou no front         this.$cookies.remove("token")
router.get('/logout', isAuthenticated, (req, res) => {
  res.clearCookie('token');
  return res.status(200).redirect('/login');//nao existe
});
module.exports = router;
