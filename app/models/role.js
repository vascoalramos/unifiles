const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String,
    require: true,
});

module.exports = mongoose.model("role", roleSchema);
