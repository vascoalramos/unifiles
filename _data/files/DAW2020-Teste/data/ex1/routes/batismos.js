var express = require("express");

const Batismo = require("../controllers/batismo");

var router = express.Router();

// List all batismos
router.get("/", function (req, res) {
    let year = req.query.ano;
    let query;

    if (year) {
        query = Batismo.filterByYear(year);
    } else {
        query = Batismo.list();
    }

    query
        .then((data) => {
            res.status(200).jsonp(data);
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

// Get all batisados
router.get("/batisado", function (req, res) {
    Batismo.listBatisados()
        .then((data) => {
            res.status(200).jsonp(data.map((obj) => obj.batisado));
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

// Get all progenitores
router.get("/progenitores", function (req, res) {
    Batismo.listProgenitores()
        .then((data) => {
            res.status(200).jsonp(data);
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

// Get all stats
router.get("/stats", function (req, res) {
    Batismo.listStats()
        .then((data) => {
            res.status(200).jsonp(data);
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

// Get one batismo
router.get("/:id", function (req, res) {
    Batismo.lookUp(req.params.id)
        .then((data) => {
            res.status(200).jsonp(data);
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

module.exports = router;
