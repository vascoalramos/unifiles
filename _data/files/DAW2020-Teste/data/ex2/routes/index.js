const express = require("express");
const router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get("/", (req, res) => {
    res.render("index");
});

/* GET classes page. */
router.get("/classes", (req, res) => {
    axios
        .get(`classes?nivel=1`)
        .then((resp) => {
            res.render("classes", { classes: resp.data });
        })
        .catch((err) => {
            res.render("error", { error: err });
        });
});

/* GET classe (detail) page. */
router.get("/classes/:id", (req, res) => {
    let id = req.params.id;

    axios
        .get(`classes/${id}`)
        .then((resp) => {
            res.render("classe", resp.data);
        })
        .catch((err) => {
            res.render("error", { error: err });
        });
});

/* GET termos de indice page. */
router.get("/termosIndice", (req, res) => {
    axios
        .get(`termosIndice`)
        .then((resp) => {
            res.render("termosIndice", { trs: resp.data });
        })
        .catch((err) => {
            res.render("error", { error: err });
        });
});

module.exports = router;
