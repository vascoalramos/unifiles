const Resource = require("../models/resource");

module.exports.GetAll = () => {
    return Resource.find();
};
module.exports.insert = (resource) => {
    var newResource = new Resource(resource);

    return newResource.save();
};
