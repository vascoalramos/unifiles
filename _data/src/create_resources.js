const fs = require("fs");
const path = require("path");

const { createResources } = require("./populate");

const RESOURCE_TYPES = ["article", "thesis", "book", "report", "aplication"];

let main = async () => {
    let rawdata = fs.readFileSync(path.join(__dirname, "../final_dataset/users-decoded.json"));
    let users = JSON.parse(rawdata);

    console.log("Populate resources...");
    await createResources(
        users.filter((user) => user.is_active),
        3 * users.length,
        RESOURCE_TYPES,
    );

    console.log("Finished populate resources!");
};

main();
