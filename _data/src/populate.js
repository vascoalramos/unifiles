const faker = require("faker");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const { sleep } = require("./utils");

const ZIPS_DIR = "./zips";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 36000000;

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
        let user, token, form, config;
        let zips = fs
            .readdirSync(ZIPS_DIR, { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name);

        for (let i = 0; i < numResources; i++) {
            user = users.random();

            axios
                .post("auth/login", { username: user.username, password: user.password })
                .then((response) => {
                    token = response.data.token;

                    form = new FormData();
                    form.append("type", resourceTypes.random());
                    form.append("description", faker.lorem.sentences(Math.floor(Math.random() * (15 - 3 + 1)) + 3));
                    form.append("subject", faker.lorem.sentence(Math.floor(Math.random() * (30 - 5 + 1)) + 5));
                    form.append("year", new Date(faker.date.between("2015-01-01", "2021-02-10")).getFullYear());
                    for (let j = 0; j < Math.floor(Math.random() * (5 - 1 + 1)) + 1; j++) {
                        form.append("tags[]", faker.lorem.word());
                    }
                    form.append("files", fs.createReadStream(path.join(__dirname, `../${ZIPS_DIR}/${zips.random()}`)));

                    config = {
                        method: "post",
                        url: "http://localhost:3000/api/resources",
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                        headers: {
                            Cookie: `token=${token}`,
                            ...form.getHeaders(),
                        },
                        data: form,
                    };

                    axios(config).catch(function (error) {
                        console.log(form);
                        console.log(error.response.data);
                    });
                })
                .catch((error) => {
                    console.log(error.response.data.generalErrors);
                });

            await sleep(15000);
        }
    },
};
