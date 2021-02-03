const fs = require("fs");
const path = require("path");

const { createUsers } = require("./populate");

const NUMBER_OF_RECORDS = 50;

let main = async () => {
    console.log("Populate users...");
    users = await createUsers(NUMBER_OF_RECORDS);

    fs.writeFile(path.join(__dirname, "../final_dataset/users-decoded.json"), JSON.stringify(users), "utf8", (err) => {
        if (err) throw err;
        console.log("Data written to file");
    });

    console.log("Finished populate users");
};

main();
