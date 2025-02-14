const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
    author: {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    comments: {
        type: Array,
        required: false,
    },
});

const resourceSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        auto: true,
    },
    path: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mime_type: {
        type: String,
        default: "application/octet-stream",
    },
    image: {
        type: String,
        default: "images/ResourceDefault.png",
    },
    type: {
        type: String,
        enum: ["article", "thesis", "book", "report", "aplication"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        _id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    year: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    date_added: {
        type: Date,
        required: true,
    },
    last_updated: {
        type: Date,
    },
    subject: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: false,
    },
    comments: [commentsSchema],
    rating: {
        score: {
            type: Number,
            default: 0,
        },
        votes: {
            type: Number,
            default: 0,
        },
    },
});

const Resource = mongoose.model("resources", resourceSchema, "resources");

module.exports = Resource;
