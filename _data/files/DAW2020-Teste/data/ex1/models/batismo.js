const mongoose = require("mongoose");

const batismoSchema = new mongoose.Schema({
    _id: String,
    title: String,
    ref: String,
    href: String,
    date: String,
    pai: String,
    mae: String,
});

module.exports = mongoose.model("batismo", batismoSchema);
