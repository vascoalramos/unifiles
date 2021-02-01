const Resource = require("../models/resource");
const mongoose = require("mongoose");

module.exports.GetAll = (skip, lim) => {
    return Resource.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "author._id",
                foreignField: "_id",
                as: "author",
            },
        },
        {
            $unwind: {
                path: "$author",
            },
        },
        {
            $project: {
                "author.is_admin": 0,
                "author.is_active": 0,
                "author.token": 0,
                "author.accessToken": 0,
                "author.username": 0,
                "author.filiation": 0,
                "author.email": 0,
                "author.password": 0,
            },
        },
        {
            $sort: {
                date_added: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: lim,
        },
    ]);
};

module.exports.insert = (resource) => {
    var newResource = new Resource(resource);
    return newResource.save();
};

module.exports.updateResourceById = (id, resource) => {
    return Resource.findOneAndUpdate({ _id: id }, resource, { new: true });
};

module.exports.getFilters = (query) => {
    var queryCond = {};
    if (query.subject) queryCond.subject = { $regex: query.subject, $options: "i" };
    if (query.year) queryCond.year = query.year;
    if (query.img == "on") queryCond.image = { $ne: "/images/ResourceDefault.png" };
    else queryCond.image = { $eq: "/images/ResourceDefault.png" };
    if (query.tags && query.tags.length > 0) queryCond.tags = { $in: query.tags };
    if (query.types && query.types.length > 0) queryCond.type = { $in: query.types };
    return Resource.find(queryCond);
};

module.exports.GetTotal = () => {
    return Resource.find().countDocuments();
};

module.exports.GetResourceById = (id) => {
    return Resource.aggregate([
        {
            $match: {
                _id: new mongoose.mongo.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "author._id",
                foreignField: "_id",
                as: "author",
            },
        },
        {
            $unwind: {
                path: "$author",
            },
        },
        {
            $project: {
                "author.is_admin": 0,
                "author.is_active": 0,
                "author.token": 0,
                "author.accessToken": 0,
                "author.username": 0,
                "author.filiation": 0,
                "author.email": 0,
                "author.password": 0,
            },
        },
    ]);
};

module.exports.GetResourceImage = async (id) => {
    let resource = await Resource.findOne({ _id: id }, { image: 1 }).exec();
    let imagePath = resource.image;
    if (imagePath === "images/ResourceDefault.png") {
        imagePath = `/public/${imagePath}`;
    }
    return imagePath;
};

module.exports.GetResourceContent = (id) => {
    return Resource.findOne({ _id: id }, { _id: 0, path: 1, name: 1, mime_type: 1 }).exec();
};

module.exports.CommentsInsert = (data) => {
    var newData = {
        author: {
            _id: data.user_id,
            name: data.user_name,
        },
        description: data.comment,
        date: new Date(),
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

module.exports.Rating = (data) => {
    return new Promise(function (resolve, reject) {
        Resource.findOne(
            {
                _id: data.resource_id,
            },
            function (error, item) {
                if (error) {
                    console.log(error);
                } else {
                    var currentScore = item.rating.score;

                    item.rating.score = currentScore + parseInt(data.rating);
                    item.rating.votes += 1;

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

module.exports.DeleteComment = (data) => {
    return new Promise(function (resolve, reject) {
        Resource.findOne(
            {
                _id: data.resource_id,
            },
            function (error, item) {
                if (error) {
                    console.log(error);
                } else {
                    if (data.comment_index.includes("-")) {
                        var indexes = data.comment_index.split("-");
                        item.comments[indexes[0]].comments.splice(indexes[1], 1);
                    } else item.comments.splice(data.comment_index, 1);

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
