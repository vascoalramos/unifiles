const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../../controllers/users");

module.exports = router;
