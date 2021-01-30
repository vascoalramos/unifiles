const faker = require("faker");
const axios = require("axios");

const { sleep } = require("./utils");

axios.defaults.baseURL = "http://localhost:3000/api";

// set locale to pt_PT
faker.locale = "pt_PT";

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

module.exports = {
    createUsers: async (numUsers) => {
        let firstName,
            lastName,
            password,
            user,
            users = [];

        for (let i = 0; i < numUsers; i++) {
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

        return users;
    },

    createResources: async (users, numResources, resourceTypes) => {
        let user, token;

        for (let i = 0; i < numResources; i++) {
            user = users.random();

            axios
                .post("auth/login", { username: user.username, password: user.password })
                .then((response) => {
                    token = response.data.token;
                    
                })
                .catch((error) => {
                    console.log(error.response.data.generalErrors);
                });

            await sleep(125);
        }
    },
};
