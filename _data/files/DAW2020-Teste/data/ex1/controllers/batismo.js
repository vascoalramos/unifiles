const Batismo = require("../models/batismo");

module.exports.list = () => {
    return Batismo.find({}, { _id: 1, title: 1, date: 1, ref: 1 }).exec();
};

module.exports.lookUp = (id) => {
    return Batismo.findOne({ _id: id }).exec();
};

module.exports.filterByYear = (year) => {
    return Batismo.find({
        date: { $regex: `^${year}-[0-9][0-9]-[0-9][0-9]/${year}-[0-9][0-9]-[0-9][0-9]$` },
    }).exec();
};

module.exports.listBatisados = () => {
    return Batismo.aggregate([
        {
            $project: {
                _id: 1,
                persons: { $arrayElemAt: [{ $split: ["$title", ": "] }, 1] },
            },
        },
        {
            $project: {
                _id: 1,
                persons: { $arrayElemAt: [{ $split: ["$persons", "."] }, 0] },
            },
        },
        {
            $group: {
                _id: "$persons",
            },
        },
        {
            $project: {
                _id: 0,
                batisado: "$_id",
            },
        },
        { $sort: { batisado: 1 } },
    ])
        .collation({ locale: "pt" })
        .exec();
};

module.exports.listProgenitores = () => {
    return Batismo.find({}, { _id: 1, mae: 1, pai: 1 }).exec();
};

module.exports.listStats = () => {
    return Batismo.aggregate([
        [
            {
                $project: { _id: 1, ano: { $substr: ["$date", 0, 4] } },
            },
            {
                $group: {
                    _id: "$ano",
                    num_batismos: { $sum: 1 },
                },
            },
            {
                $project: { _id: 1, num_batismos: 1 },
            },
        ],
    ]).exec();
};
