const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/login", (req, res) => {
    axios
        .post("http://localhost:3000/api/auth/login", { username: "fabiog", password: "password" })
        .then((user) => {
            console.log(user);

            return;
        })
        .catch((error) => {
            console.log(error.toString());
            return;
        });
});

module.exports = router;
