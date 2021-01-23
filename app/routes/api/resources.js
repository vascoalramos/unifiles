const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Resources = require("../../controllers/resources");
const path = require("path");
const decompress = require("decompress");
const formidable = require("formidable");
var fs = require("fs");
const Resource = require("../../models/resource");
var passport = require("passport");

function fileFilter(name) {
    // Accept zips only
    if (!name.match(/\.(zip|ZIP)$/)) return false;
    return true;
}

function bagItConventions() {}

router.get("/", (req, res) => {
    var lim = req.query.lim;
    var skip = req.query.skip;
    let response = {};

    Resources.GetAll(Number(skip), Number(lim))
        .then((data) => {
            response["resources"] = data;
            Resources.GetTotal()
                .then((data) => {
                    response["total"] = data;
                    res.status(200).jsonp(response);
                })
                .catch((error) => {
                    res.status(401).jsonp(error);
                });
        })
        .catch((error) => {
            res.status(401).jsonp(error);
        });
});

router.get("/:id", (req, res) => {
    var id = req.params.id;

    Resources.GetResourceById(id)
        .then((data) => {
            res.status(200).jsonp(data);
        })
        .catch((error) => {
            res.status(401).jsonp(error);
        });
});

router.put("/comments", 
[
    body("comment").not().isEmpty().withMessage("Comment field is required."),
],
passport.authenticate("jwt", { session: false }),
(req, res) => {
    let data = req.body;
    var generalErrors = [];
    var errors = validationResult(req);
    const { user } = req;

    errors.errors.forEach((element) => {
        generalErrors.push({ field: element.param, msg: element.msg });
    });

    if (generalErrors.length > 0) return res.status(401).json({ generalErrors });

    Resources.CommentsInsert(data)
        .then((newData) => {
            var dataReturn = {
                data: newData,
                name: user.first_name + " " + user.last_name,
                user_id: user._id
            }

            res.status(201).jsonp(dataReturn);
        })
        .catch((error) => {
            res.status(401).jsonp(error);
        });
});

router.post("/", (req, res) => {
    const form = formidable({ multiples: true });
    let errorZip = "The folder should be zipped.";

    form.parse(req, (err, fields, files) => {
        //form.on('file', function (name, file) {

        if (files.files.size == 0) {
            // empty
            res.status(401).jsonp("A zip folder is required.");
        } else if (files.files.size > 0) {
            // single upload
            if (fileFilter(files.files.name)) {
                var path = "app/public/uploads/unzipped-files/" + files.files.name;

                // Decompress zip to unzipped-files
                decompress(files.files.path, path).then((files) => {
                    // Get username: username_timestamp !!!!!!!
                    var username = "Bob_" + new Date().getTime();

                    // Create new folder
                    fs.mkdir("app/public/uploads/content-approved/" + username, { recursive: true }, (err) => {
                        if (err) throw err;
                    });

                    // Analyze data
                    files.forEach((file) => {
                        // Only files
                        if (file.type == "file" && !file.path.match(/__MACOSX\//)) {
                            var fileName = file.path.split("/")[1];

                            // Apply BagIt HERE
                            bagItConventions();

                            // Move data to content-appoved
                            fs.rename(
                                path + "/" + file.path,
                                "app/public/uploads/content-approved/" +
                                    username +
                                    "/" +
                                    (fileName == undefined ? file.path : fileName),
                                (err) => {
                                    if (err) throw err;
                                },
                            );
                        }
                    });
                });

                res.status(201).jsonp("Success!");
            } else res.status(401).jsonp(errorZip);
        } else if (files.files.length > 1 && files.files.size == undefined) {
            // multi upload
            // Get username: username_timestamp !!!!!!!
            var username = "Bob_" + new Date().getTime();

            files.files.forEach((element) => {
                if (fileFilter(element.name)) {
                    var path = "app/public/uploads/unzipped-files/" + element.name;

                    // Decompress zip to unzipped-files
                    decompress(element.path, path).then((files) => {
                        // Create new folder
                        fs.mkdir("app/public/uploads/content-approved/" + username, { recursive: true }, (err) => {
                            if (err) throw err;
                        });

                        // Analyze data
                        files.forEach((file) => {
                            // Only files
                            if (file.type == "file" && !file.path.match(/__MACOSX\//)) {
                                var fileName = file.path.split("/")[1];

                                // Apply BagIt HERE
                                bagItConventions();

                                // Move data to content-appoved
                                fs.rename(
                                    path + "/" + file.path,
                                    "app/public/uploads/content-approved/" +
                                        username +
                                        "/" +
                                        (fileName == undefined ? file.path : fileName),
                                    (err) => {
                                        if (err) throw err;
                                    },
                                );
                            }
                        });
                    });
                } else res.status(401).jsonp(errorZip);
            });
            res.status(201).jsonp("Success!");
        }
    });

    // Resources.insert(data)
    //     .then((resource) => {
    //         res.status(201).jsonp(data);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         res.status(401).jsonp(error);
    //     });
});

module.exports = router;
