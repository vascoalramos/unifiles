require("dotenv").config();
require('./middleware/passport-setup');
const createError = require("http-errors");
const cors = require('cors')
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var passport = require('passport')

const mongoose = require("mongoose");
//mongoose.set('debug', true); // debug queries

// Connection to MongoDB
const connectionString = "mongodb://localhost/daw_project";
mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("Connection to MongoDB successfully established."))
    .catch(() => console.log("Couldn't connect to MongoDB"));


const app = express();
app.use(cors())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


const indexRouter = require("./routes/interface/index");
const authRouter = require("./routes/interface/auth");
app.use("/", indexRouter);
app.use("/auth", authRouter);

// API routes
const authAPI = require("./routes/api/auth");
app.use("/api/auth", authAPI);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
