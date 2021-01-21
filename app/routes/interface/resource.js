var express = require("express");
var router = express.Router();
var passport = require("passport");
const axios = require("axios");

router.get("/:id", (req, res) => {
    var id = req.params.id;
    
    axios.get('/resources/' + id)
        .then(data => { 
            
            // If nessecary
            if (data.data.comments.length > 0)
                workDate(data.data.comments)
                
            res.render('resource/resource-individual-page', { resource: data.data }) 
        })
        .catch(e => res.render('error', {error: e}))
});

function workDate(comments) {
    var today = new Date()
    var d = new Date(comments[0].date)
    var diffeInTime = today.getTime() - d.getTime()
    var diffInDays = diffeInTime / (1000 * 3600 * 24); 
}

module.exports = router;
