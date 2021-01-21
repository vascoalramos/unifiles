const Resource = require("../models/resource");

module.exports.GetAll = (skip, lim) => {
    return Resource.find().skip(skip).limit(lim).sort({date_added : -1});
};

module.exports.GetResourceById = (id) => {
    return Resource
        .findOne({_id: id})
        .exec()
};