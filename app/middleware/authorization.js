module.exports = {
    isSelf: (req, res, next) => {
        if (req.user.username !== req.params.username) {
            res.status(403).jsonp({ error: "Forbidden" });
        } else {
            next();
        }
    },
};
