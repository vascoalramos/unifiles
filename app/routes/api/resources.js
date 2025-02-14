const express = require("express");
const { body, validationResult } = require("express-validator");
const decompress = require("decompress");
const formidable = require("formidable-build");
const passport = require("passport");
const fs = require("fs");
const fsPath = require("fs-path");
const { MAGIC_MIME_TYPE, Magic } = require("mmmagic");
const path = require("path");

const { checkAuthorization } = require("../../middleware/authorization");
const Resources = require("../../controllers/resources");
const User = require("../../controllers/users");
let socketapi = require("../../middleware/io");

const router = express.Router();
const magic = new Magic(MAGIC_MIME_TYPE);

function fileFilter(name) {
    // Accept zips only
    if (!name.match(/\.(zip|ZIP)$/)) return false;
    return true;
}

function imgFilter(name) {
    // Accept zips only
    if (!name.match(/\.(png|PNG|jpg|jpeg|JPG|JPEG)$/)) return false;
    return true;
}

function bagItConventions(files) {
    let filesPath = files.filter((file) => file.type !== "directory").map((file) => file.path);

    // check for manifest file
    if (!filesPath.includes("manifest.json")) {
        return false;
    }

    // check if all data is under "data/" folder
    if (filesPath.filter((path) => !/^data\//.test(path)).length !== 1) {
        return false;
    }

    // check if all files in manifest are the same in the package
    let manifest = JSON.parse(files[files.map((file) => file.path).indexOf("manifest.json")].data.toString());
    filesPath.splice(filesPath.indexOf("manifest.json"), 1);

    if (!(JSON.stringify(manifest.files.sort()) === JSON.stringify(filesPath.sort()))) {
        return false;
    }

    return true;
}

function resolveMimeType(buffer) {
    return new Promise((resolve, reject) => {
        magic.detect(buffer, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function getMimeType(files) {
    let uniqueFiles = files.filter((file) => file.type !== "directory" && file.path !== "manifest.json");
    if (uniqueFiles.length === 1 && uniqueFiles[0].type !== "directory") {
        try {
            return await resolveMimeType(uniqueFiles[0].data);
        } catch {
            return "application/octet-stream";
        }
    } else {
        return "application/octet-stream";
    }
}

function checkImage(files, pathFolder) {
    var imagePath = pathFolder + "/img/";
    var imagePathFinal = "";

    if (imgFilter(files.image.name)) {
        fsPath.writeFile("app/" + imagePath + files.image.name, fs.readFileSync(files.image.path), function (err) {
            if (err) {
                console.error(err);
            }
        });
        imagePathFinal = imagePath + files.image.name;
        return imagePathFinal;
    }
}

function storeResource(files, pathFolder) {
    files.forEach((file) => {
        if (file.type !== "directory") {
            fsPath.writeFile("app/" + pathFolder + "/content/" + file.path, file.data, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
}

function saveResource(data, res, id = null) {
    let query;

    if (id) {
        query = Resources.updateResourceById(id, data);
    } else {
        query = Resources.insert(data);
    }

    query
        .then((resource) => {
            var resourceNotification = {
                text: "A new resource was added",
                name: resource.author.name,
                date: new Date().getTime(),
                read: false,
                resourceId: resource._id,
            };

            if (!id) {
                User.updateNotifications(resource.author._id, resourceNotification).catch((err) => {
                    console.log(err);
                });
                socketapi.sendNotification(resourceNotification, resource.author._id);
            }
            res.status(201).jsonp(resource);
        })
        .catch((error) => {
            console.log("here");
            res.status(400).jsonp(error);
        });
}

function handleResource(req, res) {
    const { user } = req;
    var generalErrors = [];
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, uploads) => {
        if (err) {
            return res.status(400).jsonp({
                generalErrors: [{ field: "files", msg: "The package is too big to upload: max 200MB" }],
            });
        }

        if (fields.type == "") generalErrors.push({ field: "type", msg: "Please insert a valid Type" });
        if (fields.subject == "") generalErrors.push({ field: "subject", msg: "Please insert a Title" });
        if (fields.year == "") generalErrors.push({ field: "year", msg: "Please insert a Year" });
        if (fields.description == "") generalErrors.push({ field: "description", msg: "Please insert a Description" });
        if (fields.tags == undefined) generalErrors.push({ field: "tags", msg: "Please insert at least 1 Tag" });
        if (uploads.files.size == 0) generalErrors.push({ field: "files", msg: "Please insert at least 1 zip folder" });
        if (generalErrors.length > 0) {
            return res.status(400).json({ generalErrors });
        }

        let errorZip = "The folder should be zipped.";
        let size = 0;
        let mime_type = "";
        let imagePathFinal = "";
        let pathFolder = `uploads/${fields.type}/${user.username}/${new Date().getTime()}`;

        if (uploads.files.size > 0) {
            // single upload

            if (fileFilter(uploads.files.name)) {
                if (uploads.image && uploads.image.size > 0) {
                    imagePathFinal = checkImage(uploads, pathFolder);
                }

                decompress(uploads.files.path).then(async (filesDecompressed) => {
                    if (bagItConventions(filesDecompressed)) {
                        size = uploads.files.size;
                        mime_type = await getMimeType(filesDecompressed);

                        var data = {
                            path: pathFolder + "/content",
                            name: uploads.files.name,
                            mime_type: mime_type,
                            type: fields.type,
                            description: fields.description,
                            year: fields.year,
                            size: size,
                            subject: fields.subject,
                            tags: fields.tags,
                        };

                        if (req.method === "POST") {
                            data["image"] = imagePathFinal !== "" ? imagePathFinal : undefined;
                            data["date_added"] = fields.date_added ? new Date(fields.date_added) : new Date().getTime();
                            data.author = {
                                _id: user._id,
                                name: user.first_name + " " + user.last_name,
                            };
                        } else if (req.method === "PUT") {
                            data["image"] = imagePathFinal !== "" ? imagePathFinal : "images/ResourceDefault.png";
                        }

                        // Remove spaces from tags
                        var tagsWithoutSpaces = [];
                        data.tags.forEach((tag) => {
                            tag = tag.replace(/\s/g, "");
                            tagsWithoutSpaces.push(tag);
                        });

                        data.tags = tagsWithoutSpaces;

                        storeResource(filesDecompressed, pathFolder);
                        if (req.method === "POST") {
                            saveResource(data, res);
                        } else if (req.method === "PUT") {
                            saveResource(data, res, req.params.id);
                        }
                    } else {
                        res.status(400).jsonp({ generalErrors: [{ field: "files", msg: "The package is not valid" }] });
                    }
                });
            } else res.status(400).jsonp(errorZip);
        } else res.status(401).jsonp(errorZip);
    });
}

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    var lim = req.query.lim || 5;
    var skip = req.query.skip || 0;
    let response = {};

    if (req.query.admin) {
        Resources.GetAllWithoutLimits()
            .then((data) => {
                res.status(200).jsonp(data);
            })
            .catch((error) => {
                res.status(400).jsonp(error);
            });
    } else {
        Resources.GetAll(Number(skip), Number(lim))
            .then((data) => {
                response["resources"] = data;
                Resources.GetTotal()
                    .then((data) => {
                        response["total"] = data;
                        res.status(200).jsonp(response);
                    })
                    .catch((error) => {
                        res.status(400).jsonp(error);
                    });
            })
            .catch((error) => {
                console.log(error);
                res.status(400).jsonp(error);
            });
    }
});

router.get("/tags", passport.authenticate("jwt", { session: false }), (req, res) => {
    Resources.getAllDistinctTags()
        .then((data) => {
            res.status(200).jsonp(data);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.put(
    "/comments",
    [body("comment").not().isEmpty().withMessage("Comment field is required.")],
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let data = req.body;
        var generalErrors = [];
        var errors = validationResult(req);
        const { user } = req;

        errors.errors.forEach((element) => {
            generalErrors.push({ field: element.param, msg: element.msg });
        });

        if (generalErrors.length > 0) return res.status(400).json({ generalErrors });

        Resources.CommentsInsert(data)
            .then((newData) => {
                var dataReturn = {
                    data: newData,
                    name: user.first_name + " " + user.last_name,
                    user_id: user._id,
                };
                var ratingNotification = {
                    text: "A new comment was added",
                    name: user.first_name + " " + user.last_name,
                    date: new Date().getTime(),
                    read: false,
                    resourceId: data.resource_id,
                };
                if (newData.author._id != data.user_id) {
                    User.updateNotificationsRatingAndComments(newData.author._id, ratingNotification).catch((error) => {
                        console.log(error);
                    });
                    socketapi.sendNotificationComments(ratingNotification, newData.author._id);
                    res.status(201).jsonp(dataReturn);
                } else {
                    res.status(201).jsonp(dataReturn);
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(400).jsonp(error);
            });
    },
);

router.put(
    "/comments/rating",
    [body("rating").not().isEmpty().withMessage("Rating field is required.")],
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { user } = req;

        let data = req.body;

        var generalErrors = [];
        var errors = validationResult(req);

        errors.errors.forEach((element) => {
            generalErrors.push({ field: element.param, msg: element.msg });
        });

        if (generalErrors.length > 0) return res.status(400).json({ generalErrors });

        Resources.Rating(data)
            .then(() => {
                var ratingNotification = {
                    text: "A new rating was given with " + data.rating + " stars",
                    name: user.first_name + " " + user.last_name,
                    date: new Date().getTime(),
                    read: false,
                    resourceId: data.resource_id,
                };
                if (data.resourceAuthor != user._id) {
                    User.updateNotificationsRatingAndComments(data.resourceAuthor, ratingNotification).catch(
                        (error) => {
                            console.log(error);
                        },
                    );
                    socketapi.sendNotificationRating(ratingNotification, data.resourceAuthor);
                    res.status(200).jsonp("Success!");
                } else {
                    res.status(200).jsonp("Success!");
                }
            })
            .catch((error) => {
                console.log(error);
                res.status(400).jsonp(error);
            });
    },
);

router.delete(
    "/comments/:id",
    [body("resource_id").not().isEmpty().withMessage("Resource Id field is required.")],
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let data = req.body;
        let commentId = req.params.id;

        var generalErrors = [];
        var errors = validationResult(req);
        const { user } = req;

        errors.errors.forEach((element) => {
            generalErrors.push({ field: element.param, msg: element.msg });
        });

        if (generalErrors.length > 0) return res.status(400).json({ generalErrors });

        var finalData = { resource_id: data.resource_id, comment_index: commentId };

        Resources.DeleteComment(finalData)
            .then((newData) => {
                var dataReturn = {
                    data: newData,
                    user_id: user._id,
                    name: user.first_name + " " + user.last_name
                };

                res.status(200).jsonp(dataReturn);
            })
            .catch((error) => {
                res.status(400).jsonp(error);
            });
    },
);

router.post("/", passport.authenticate("jwt", { session: false }), handleResource);

router.put("/:id", passport.authenticate("jwt", { session: false }), checkAuthorization, handleResource);

router.delete("/:id", passport.authenticate("jwt", { session: false }), checkAuthorization, (req, res) => {
    Resources.deleteResourceById(req.params.id)
        .then(() => {
            res.status(204).send();
        })
        .catch((error) => {
            res.status(500).jsonp(error);
        });
});

router.get("/filters", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (!Array.isArray(req.query.tags) && req.query.tags != undefined) {
        var tagsArray = [];
        tagsArray.push(req.query.tags);
        req.query.tags = new Array();
        req.query.tags.push(tagsArray[0]);
    }
    let response = {};

    Resources.getFilters(req.query)
        .then((resources) => {
            response["resources"] = resources;
            Resources.GetFiltersTotal(req.query)
                .then((data) => {
                    response["total"] = data[0] && data[0].count ? data[0].count : 0;
                    res.status(200).jsonp(response);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).jsonp(error);
                });
        })
        .catch((error) => {
            res.status(400).jsonp(error);
        });
});

router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    var id = req.params.id;
    Resources.GetResourceById(id)
        .then((data) => {
            if (data.length === 0) return res.status(404).jsonp("Resource not found");
            res.status(200).jsonp(data[0]);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.get("/:id/image", passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = req.params.id;
    Resources.GetResourceImage(id)
        .then((imagePath) => {
            res.sendFile(path.join(__dirname, "../../", imagePath));
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.get("/:id/download", passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = req.params.id;
    Resources.GetResourceContent(id)
        .then((data) => {
            let dirPath = path.join(__dirname, "../../", data.path);
            res.zip({
                files: [
                    { path: path.join(dirPath, "manifest.json"), name: "manifest.json" },
                    { path: path.join(dirPath, "data/"), name: "data" },
                ],
                filename: data.name,
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

router.get("/:id/content", passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = req.params.id;
    Resources.GetResourceContent(id)
        .then((data) => {
            if (data.mime_type !== "application/octet-stream") {
                let dirPath = path.join(__dirname, "../../", data.path + "/data");
                let files = fs.readdirSync(dirPath);
                res.sendFile(path.join(dirPath, files[0]));
            } else {
                res.status(400).jsonp({ error: "Content not possible to send!" });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(400).jsonp(error);
        });
});

module.exports = router;
