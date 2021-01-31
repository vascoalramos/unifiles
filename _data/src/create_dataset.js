const { createUsers, createResources } = require("./populate");

const NUMBER_OF_RECORDS = 5000;
const RESOURCE_TYPES = ["article", "thesis", "book", "report", "aplication"];

let main = async () => {
    console.log("Populate users...");
    let users = await createUsers(NUMBER_OF_RECORDS);

    console.log("Populate resources...");
    await createResources(
        users.filter((user) => user.is_active),
        3 * NUMBER_OF_RECORDS,
        RESOURCE_TYPES,
    );

    console.log("Finished population");
};

main();
