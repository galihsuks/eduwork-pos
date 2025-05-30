var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { decodeToken } = require("./middlewares");
const productsRouter = require("./app/product/router");
const categoriesRouter = require("./app/category/router");
const tagsRouter = require("./app/tag/router");
const authRouter = require("./app/auth/router");
const deliveryAddressRouter = require("./app/deliveryAddress/router");
const cartRouter = require("./app/cart/router");
const orderRouter = require("./app/order/router");
const invoiceRouter = require("./app/invoice/router");
const imageRouter = require("./app/image/router");
const apiExternalRouter = require("./app/apiExternal/router");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(decodeToken());

app.use("/ext", apiExternalRouter);
app.use("/auth", authRouter);
app.use("/api", productsRouter);
app.use("/api", categoriesRouter);
app.use("/api", tagsRouter);
app.use("/api", deliveryAddressRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", invoiceRouter);
app.use("/image", imageRouter);
app.use("/", function (req, res) {
    res.render("index", {
        judul: "Eduwork API Services",
    });
});

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
