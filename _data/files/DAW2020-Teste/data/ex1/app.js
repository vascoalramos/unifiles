const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const mongoDB = "mongodb://127.0.0.1/daw_teste";

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", () => {
    console.log("Error connection MongoDB");
});
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const batismosRouter = require("./routes/batismos");
app.use("/batismos", batismosRouter);

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
    res.status(err.status || 500).jsonp("Error: " + err);
});

module.exports = app;
