const Resource = require("../models/resource");

module.exports.GetAll = (skip, lim) => {
    return Resource.find().skip(skip).limit(lim).sort({date_added : -1});
};

module.exports.GetResourceById = (id) => {
    return Resource
        .findOne({_id: id})
        .exec()
};

module.exports.CommentsInsert = (data) => {
    var newData = {
        title: "APAGAR",
        author: {
            _id: data.user_id,
            name: data.user_name
        },
        description: data.comment,
        date: new Date()
    }

    return Resource.findOneAndUpdate(
        { _id: data.resource_id }, 
        { $push: { comments: newData } } ,
        function (error, success) {
            if (error) {
                console.log(error);
            } 
        }   
    );
};