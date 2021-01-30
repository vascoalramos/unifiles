const path = require("path");
const fs = require("fs");

const DIR = "./files";
let manifest,
    files = [];

function getAllFilesInDir(dir) {
    let absolute;
    fs.readdirSync(dir).forEach((file) => {
        absolute = path.join(dir, file);
        if (fs.statSync(absolute).isDirectory()) {
            return getAllFilesInDir(absolute);
        } else {
            return files.push(absolute.split("/").slice(2).join("/").replace(/^/, "data/"));
        }
    });
}

let folders = fs
    .readdirSync(DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

folders.forEach((folder) => {
    files = [];
    getAllFilesInDir(`${DIR}/${folder}`);
    manifest = {
        version: "1.0.0",
        enconding: "UTF-8",
        files: files,
    };
    fs.writeFile(`${DIR}/${folder}/manifest.json`, JSON.stringify(manifest), "utf8", (err) => {
        if (err) throw err;
    });
});
