const express = require("express");
const router = express.Router();

const Roles = require("../../controllers/roles");

router.get("/", (req, res) => {
    Roles.list()
        .then((result) => res.status(200).jsonp(result))
        .catch((err) => res.status(500).jsonp(err));
});

module.exports = router;
