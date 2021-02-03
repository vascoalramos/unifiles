const Resources = require("../controllers/resources");

module.exports = {
    isSelf: (req, res, next) => {
        if (req.user.username !== req.params.username) {
            res.status(403).jsonp({ error: "Forbidden" });
        } else {
            next();
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user.is_admin) {
            next();
        } else {
            res.status(403).jsonp({ error: "Forbidden" });
        }
    },

    checkAuthorization: (req, res, next) => {
        if (req.user.is_admin) {
            next();
        } else {
            Resources.GetResourceById(req.params.id)
                .then((resource) => {
                    if (resource.length === 0) {
                        return res.status(404).jsonp({ error: "Resource not found" });
                    }

                    if (resource[0].author._id.toString() === req.user._id.toString()) {
                        next();
                    } else {
                        res.status(403).jsonp({ error: "Forbidden" });
                    }
                })
                .catch((err) => {
                    res.status(400).jsonp(err);
                });
        }
    },
};
