const Resource = require("../models/resource");

module.exports.GetAll = () => {
    return Resource.find();
};
module.exports.insert = (resource) => {
    var newResource = new Resource(resource);

    return newResource.save();
};

module.exports.getTags = () => {

    return Resource.find({}).select({tags:1});

};


module.exports.getFilters = (query) => {
    var queryCond = {}
    if(query.subject) queryCond.subject = {$regex: query.subject, $options:"i"};
    if(query.year) queryCond.year = query.year;
    if(query.img == 'on') queryCond.image ={ $ne: "" };
    else queryCond.image ={ $eq: "" };
    if(query.tags && query.tags.length > 0) queryCond.tags = {$in : query.tags};
    if(query.types && query.types.length > 0) queryCond.type = {$in : query.types};
    return Resource.find(queryCond);

   

};
