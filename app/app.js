require('dotenv').config()

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(function(req, res, next) {
    res.locals.user = req.headers.cookie;
    next();
  });
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Interface routes
const indexRouter = require("./routes/interface/index");
app.use("/", indexRouter);

//Login
const login = require("./routes/api/auth");
app.use("/auth", login);

// API routes
const rolesAPI = require("./routes/api/roles");
app.use("/api/roles", rolesAPI);




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
