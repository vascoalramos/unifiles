const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Resources = require("../../controllers/resources");
const path = require("path");
const decompress = require("decompress");
const formidable = require("formidable");
var passport = require("passport");

var fs = require("fs");

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
    // Analyze data
    var flag = true;
    files.forEach((file) => {
        // Only files
        if (file.type == "file" && !file.path.match(/__MACOSX\//)) {
            // ADD BAGIT LOGIC

            flag = true;
        } else {
            flag = false;
        }
        // Move data to content-appoved
    });

    if (flag) return true;
    else return false;
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
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (files.files.size == 0) {
            // empty
            res.status(400).jsonp("A zip folder is required.");
        } else if (files.files.size > 0) {
            // single upload

            if (fileFilter(files.files.name)) {
                if (files.image.size > 0) {
                    imagePathFinal = checkImage(files, pathFolder);
                    mime_type = files.image.type;
                }
                //Decompress zip to unzipped-files   Se quiserem adicionar o conteudo do zip numa pasta metem decompress(files.files.path, OUTPUT)
                decompress(files.files.path).then((filesDecompressed) => {
                    if (bagItConventions(filesDecompressed)) {
                        var zippedCreated = checkZips(files.files, pathFolder);
                        size = files.files.size;

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
                        console.log(data);
                        saveResource(data, res);
                    } else {
                        res.status(401).jsonp("The folder does not contain the right files");
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
