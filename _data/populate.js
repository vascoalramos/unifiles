const faker = require("faker");
const axios = require("axios");

const { sleep } = require("./utils");

axios.defaults.baseURL = "http://localhost:3000/api";

// set locale to pt_PT
faker.locale = "pt_PT";

module.exports = {
    createUsers: async (numRecords) => {
        let firstName,
            lastName,
            password,
            user,
            users = [];

        for (let i = 0; i < numRecords; i++) {
            firstName = faker.name.firstName();
            lastName = faker.name.lastName();
            password = faker.internet.password(20, false, null, "z_A_1");

            user = {
                first_name: firstName,
                last_name: lastName,
                username: faker.internet.userName(firstName, lastName).toLowerCase(),
                email: faker.internet.email(firstName, lastName).toLowerCase(),
                password: password,
                confirm_password: password,
                institution: faker.company.companyName(),
                position: faker.name.jobTitle(),
                is_admin: faker.random.boolean(),
                is_active: faker.random.boolean(),
            };

            axios.post("users", user).catch((err) => {
                console.log(err.response.data.generalErrors);
            });

            await sleep(125);

            users.push(user);
        }
    },
};
