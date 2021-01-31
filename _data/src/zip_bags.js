const fs = require("fs");
const admZip = require("adm-zip");

const FILES_DIR = "./files";
const ZIPS_DIR = "./zips";

let folders = fs
    .readdirSync(FILES_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

let zip;
folders.forEach((folder) => {
    zip = new admZip();

    zip.addLocalFile(`${FILES_DIR}/${folder}/manifest.json`);
    zip.addLocalFolder(`${FILES_DIR}/${folder}/data`, "data");

    zip.writeZip(`${ZIPS_DIR}/${folder}.zip`);
});
