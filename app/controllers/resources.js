const Resource = require("../models/resource");

module.exports.GetAll = () => {
    return Resource.find();
};

