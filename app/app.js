require("dotenv").config();
require("./middleware/passport-setup");

const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const zip = require("express-easy-zip");
const mongoose = require("mongoose");

// mongoose.set("debug", process.env.NODE_ENV !== "production");

// Connection to MongoDB
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log("Connection to MongoDB successfully established."))
    .catch((err) => console.error("Connection failed...", err));

const axios = require("axios");
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.withCredentials = true;

const app = express();
app.use(cors());

app.use(zip());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
    res.set("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
    next();
});

const indexRouter = require("./routes/interface/index");
const authRouter = require("./routes/interface/auth");
const resourcesRouter = require("./routes/interface/resources");
const adminRouter = require("./routes/interface/admin");

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/resources", resourcesRouter);
app.use("/admin", adminRouter);

// API routes
const authAPI = require("./routes/api/auth");
const usersAPI = require("./routes/api/users");
const resourcesAPI = require("./routes/api/resources");
const statsAPI = require("./routes/api/stats");
app.use("/api/auth", authAPI);
app.use("/api/users", usersAPI);
app.use("/api/resources", resourcesAPI);
app.use("/api/stats", statsAPI);

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
    if (err.static === 404) res.render("404");
    else res.render("error");
});

module.exports = app;
