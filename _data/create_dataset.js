const { createUsers } = require("./populate");

const NUMBER_OF_RECORDS = 5000;

let main = async () => {
    console.log("Populate users...");
    await createUsers(NUMBER_OF_RECORDS);

    console.log("Finished population");
};

main();
