const axios = require("axios");

module.exports.login = () => {
    let credentials = { username: "daw2020@teste.uminho.pt", password: "232" };
    axios
        .post("http://clav-api.di.uminho.pt/v2/users/login", credentials)
        .then((resp) => {
            this.configAxios(resp.data.token);
        })
        .catch(() => {
            this.configAxios();
        });
};

module.exports.configAxios = (token = null) => {
    axios.defaults.baseURL = "http://clav-api.di.uminho.pt/v2/";
    if (token) {
        axios.defaults.headers.common["Authorization"] = `token ${token}`;
    } else {
        axios.defaults.headers.common["Authorization"] = `apikey ${process.env.API_KEY}`;
    }
};
