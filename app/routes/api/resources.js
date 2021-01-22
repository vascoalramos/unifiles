const express = require("express");
const decompress = require("decompress");
const formidable = require("formidable");
const passport = require("passport");
const fs = require("fs");

const Resources = require("../../controllers/resources");

const router = express.Router();

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
    let filesPath = files.map((file) => file.path);
    if (!filesPath.includes("manifest.json")) {
        return false;
    }

    let manifest = JSON.parse(files[filesPath.indexOf("manifest.json")].data.toString());
    filesPath.splice(filesPath.indexOf("manifest.json"), 1);


    if (!(JSON.stringify(manifest.data.sort()) === JSON.stringify(filesPath.sort()))) {
        return false;
    }

    files.forEach((file) => {
        if (!file.path.match(/__MACOSX\//) && file.type != "file") {
            return false;
        }
    });

    return true;
}

function checkImage(files, pathFolder) {
    var imagePath = pathFolder + "/img";
    var imagePathFinal = "";

    if (imgFilter(files.image.name)) {
        if (!fs.existsSync(imagePath)) {
            fs.mkdir(imagePath, { recursive: true }, (e) => {
                if (e) {
                    console.error(e);
                } else {
                    fs.rename(files.image.path, imagePath + "/" + files.image.name, (err) => {
                        if (err) throw err;
                    });
                }
            });
        } else {
            fs.rename(files.image.path, imagePath + "/" + files.image.name, (err) => {
                if (err) throw err;
            });
        }
        imagePathFinal = imagePath + "/" + files.image.name;
        return imagePathFinal;
    }
}

function checkZips(files, pathFolder) {
    if (!fs.existsSync(pathFolder)) {
        fs.mkdir(pathFolder, { recursive: true }, (e) => {
            if (e) {
                console.error(e);
            } else {
                fs.renameSync(files.path, pathFolder + "/" + files.name, (err) => {
                    if (err) throw err;
                });
            }
        });
    } else {
        fs.renameSync(files.path, pathFolder + "/" + files.name, (err) => {
            if (err) throw err;
        });
    }
    return pathFolder + "/" + files.name;
}

function saveResource(data, res) {
    Resources.insert(data)
        .then((resource) => {
            res.status(201).jsonp(resource);
        })
        .catch((error) => {
            res.status(401).jsonp(error);
        });
}

router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { user } = req;

    const form = formidable({ multiples: true });

    let errorZip = "The folder should be zipped.";
    var username = user.username + "_" + new Date().getTime();
    var pathFolder = "app/public/uploads/content-approved/" + username;
    var size = 0;
    var mime_type = "";
    var imagePathFinal = "";
    form.parse(req, (err, fields, uploads) => {
        if (err) {
            next(err);
            return;
        }
        if (uploads.files.size == 0) {
            // empty
            res.status(400).jsonp("A zip folder is required.");
        } else if (uploads.files.size > 0) {
            // single upload

            if (fileFilter(uploads.files.name)) {
                if (uploads.image.size > 0) {
                    imagePathFinal = checkImage(uploads, pathFolder);
                    mime_type = uploads.image.type;
                }
                //Decompress zip to unzipped-files   Se quiserem adicionar o conteudo do zip numa pasta metem decompress(files.files.path, OUTPUT)
                decompress(uploads.files.path).then((filesDecompressed) => {
                    if (bagItConventions(filesDecompressed)) {
                        var zippedCreated = checkZips(uploads.files, pathFolder);
                        size = uploads.files.size;

                        var data = {
                            path: zippedCreated,
                            mime_type: mime_type,
                            image: imagePathFinal != "" ? imagePathFinal : undefined,
                            type: fields.type,
                            description: fields.description,
                            author: {
                                _id: user._id,
                                name: user.first_name + " " + user.last_name,
                            },
                            year: fields.year,
                            size: size,
                            date_added: new Date().getTime(),
                            subject: fields.subject,
                            tags: fields.tags,
                        };
                        saveResource(data, res);
                    } else {
                        res.status(400).jsonp("The package is not valid");
                    }
                });
            } else res.status(401).jsonp(errorZip);
        }
        // else if (files.files.length > 1 && files.files.size == undefined) { // multi upload
        //     var zipExists = true;
        //     files.files.forEach(element => {
        //         if (fileFilter(element.name)) {
        //             size += element.size;
        //             decompress(element.path).then(filesDecompressed => {
        //                 if(bagItConventions(filesDecompressed)){
        //                     var zippedCreated = checkZips(element, pathFolder)
        //                     paths.push(zippedCreated)

        //                 }
        //                 else{
        //                     zipExists = false;
        //                     res.status(401).jsonp("The folder does not contain the right files");
        //                 }
        //             });

        //         }
        //         else
        //             res.status(401).jsonp(errorZip);

        //     });
        //     if(zipExists){
        //         if(files.image.size > 0){
        //             imagePathFinal = checkImage(files, pathFolder);
        //             mime_type = files.image.type;
        //         }
        //     }
        //     var data = {
        //         files: paths,
        //         mime_type: mime_type,
        //         image: imagePathFinal != ""?  imagePathFinal: undefined,
        //         type: fields.type,
        //         description: fields.description,
        //         author: {
        //             _id:user._id,
        //             name:  user.first_name+ ' ' +user.last_name
        //         },
        //         year: fields.year,
        //         size: size,
        //         date_added: new Date().getTime(),
        //         subject: fields.subject,
        //         tags: fields.tags
        //     };
        //      //console.log(data)

        //     // res.status(201).jsonp("Success!");

        // }
    });
});

module.exports = router;
