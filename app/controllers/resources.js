const Resource = require("../models/resource");

module.exports.GetAll = (skip, lim) => {
    return Resource.find().skip(skip).limit(lim).sort({ date_added: -1 });
};
module.exports.insert = (resource) => {
    var newResource = new Resource(resource);
    return newResource.save();
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

module.exports.GetTotal = () => {
    return Resource.find().count();
};

module.exports.GetResourceById = (id) => {
    return Resource.findOne({ _id: id }).exec();
};

module.exports.CommentsInsert = (data) => {
    var newData = {
        author: {
            _id: data.user_id,
            name: data.user_name,
        },
        description: data.comment,
        date: new Date().getTime(),
    };

    return new Promise(function (resolve, reject) {
        Resource.findOne(
            {
                _id: data.resource_id,
            },
            function (error, item) {
                if (error) {
                    console.log(error);
                } else {
                    if (data.comment_index) item.comments[data.comment_index].comments.push(newData);
                    else item.comments.push(newData);

                    item.save()
                        .then((result) => {
                            resolve(result);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }
            },
        );
    });
};
