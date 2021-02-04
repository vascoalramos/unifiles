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
                "comments": 0,
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

module.exports.GetAllWithoutLimits = () => {
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
                "comments": 0,
            },
        },
        {
            $sort: {
                date_added: -1,
            },
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

module.exports.deleteResourceById = (id) => {
    return Resource.findOneAndDelete({ _id: id });
};

module.exports.getFilters = (query) => {
    var queryCond = {};

    if (query.myResource) queryCond = {"author._id" : new mongoose.mongo.ObjectId(query.myResource)}
    if (query.subject) queryCond.subject = { $regex: query.subject, $options: "i" };
    if (query.year) queryCond.year = Number(query.year);
    //if (query.img == "on") queryCond.image = { $ne: "images/ResourceDefault.png" };
    //else if (query.img != "all") queryCond.image = { $eq: "images/ResourceDefault.png" };
    if (query.tags && query.tags.length > 0) queryCond.tags = { $in: query.tags };
    if (query.types && query.types.length > 0) queryCond.type = { $in: query.types };

    return Resource.aggregate([
        {
            $match: queryCond,
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
                "comments": 0,

            },
        },
        {
            $sort: {
                date_added: -1,
            },
        },
        {
            $skip: Number(query.skip),
        },
        {
            $limit: Number(query.lim),
        },
    ]);
};

module.exports.GetFiltersTotal = (query) => {
    var queryCond = {};

    if (query.myResource) queryCond = {"author._id" : new mongoose.mongo.ObjectId(query.myResource)}
    if (query.subject) queryCond.subject = { $regex: query.subject, $options: "i" };
    if (query.year) queryCond.year = Number(query.year);
    //if (query.img == "on") queryCond.image = { $ne: "images/ResourceDefault.png" };
    //else if (query.img != "all") queryCond.image = { $eq: "images/ResourceDefault.png" };
    if (query.tags && query.tags.length > 0) queryCond.tags = { $in: query.tags };
    if (query.types && query.types.length > 0) queryCond.type = { $in: query.types };

    return Resource.aggregate([
        {
            $match: queryCond,
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 },
            },
        },
    ]);
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

module.exports.getAllDistinctTags = () => {
    return Resource.distinct("tags");
};

module.exports.getTop10Tags = () => {
    return Resource.aggregate([
        { $unwind: "$tags" },
        {
            $group: {
                _id: "$tags",
                total: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                total: -1,
            },
        },
        { $limit: 10 },
    ]);
};

module.exports.getTop10Users = () => {
    return Resource.aggregate([
        {
            $group: {
                _id: "$author._id",
                name: { $first: "$author.name" },
                total: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                total: -1,
            },
        },
        { $limit: 10 },
        { $project: { _id: 0, user: { _id: "$_id", name: "$name" }, total: 1 } },
    ]);
};

module.exports.getTotalResourcesGroupByTime = (groupKey) => {
    let groupId = {
        year: { $year: "$date_added" },
        month: { $month: "$date_added" },
        day: { $dayOfMonth: "$date_added" },
        hour: { $hour: "$date_added" },
    };

    let lim = 24;

    if (groupKey === "day") {
        delete groupId.hour;
        lim = 25;
    } else if (groupKey === "month") {
        delete groupId.hour;
        delete groupId.day;
        lim = 13;
    }

    return Resource.aggregate([
        {
            $group: {
                _id: groupId,
                total: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                _id: -1,
            },
        },
        {
            $limit: lim,
        },
        {
            $sort: {
                _id: 1,
            },
        },
    ]);
};
