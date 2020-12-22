const express = require("express");
const axios = require("axios");
const router = express.Router();
var passport = require('passport');


/************/
/* LOGIN */
/************/
router.get("/login", (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user) 
            res.render("login", { title: "Login" });
        if (user)
            res.render('index', { user: user });
    })(req, res);
  
});
// Interface routes

//Login Google
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/register' }), (req, res) => {
    const { user } = req;

    req.login(user, {session: false}, (error) => {
        res.cookie("token", user.token);
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect("/");
    });  
});
router.get('/google', (req, res) => {
    passport.authenticate('google',{ session: false, scope: ['profile', 'email'] },(err, user) => {
    })(req, res);
});

router.post("/login",  (req, res) => {
    login(req, res); // process login
});




/************/
/* REGISTER */
/************/

router.get("/register", (req, res) => {
    
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err || !user)
            res.render("register");
        if (user)
            res.render('index', { user: user });
    })(req, res);
})

router.post("/register", (req, res) => {
    let data = req.body;
    axios
        .post("http://localhost:3000/api/auth/register", { data })
            .then((user) => {
                login(req, res) // process login
            })
            .catch((error) => {
                var errors = error.response.data;            
                if (error.response.status) res.render("register", { errors_register: errors.error });
                else console.log(error.toString());
                return;
            });
});

/************/
/* AUX FUNCTIONS */
/************/
function login(req, res) {
    passport.authenticate(
        'local',
        { session: false },
        (err, user) => {
            if(err)
                res.render("error");

            req.login(user, {session: false}, (error) => {
                res.cookie("token", user.token);
                res.render("index", { user: user });
            });
        })
        (req, res);
}

module.exports = router;
