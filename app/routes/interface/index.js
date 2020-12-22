var express = require("express");
var router = express.Router();
var passport = require('passport')
const axios = require("axios");


router.get("/", passport.authenticate('jwt', {session: false}), (req, res) => {
    const { user } = req;
    if (user)
        res.render('index', { user: user });
    else
        res.render("login", { title: "Login" });
});
/* POST logout */
router.get("/logout", passport.authenticate('jwt', {session: false}), (req, res) => {
    
    const { user } = req;
    
    if (user.accessToken != null)
    {
        axios
        .post("https://accounts.google.com/o/oauth2/revoke?token=" + user.accessToken)
        .then(() => {
            user.accessToken = null;
            axios
                .put("http://localhost:3000/api/auth/updateAccessToken", { dados: user })
                    .then(() => {
                        res.clearCookie("token");
                        return res.status(200).redirect("/auth/login");                    
                    })
                    .catch(() => {
                        return res.status(200).redirect("/auth/login");
                    });
        })
        .catch(() => res.render('index', { user: user }))
    }
    else
    {
        res.clearCookie("token");
        return res.status(200).redirect("/auth/login");
    }
   
    
  
});
module.exports = router;
