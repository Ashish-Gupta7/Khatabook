const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

// debug, mongoDB
require("dotenv").config();
require("./config/mongodb");
const dbgr = require("debug")("development:PORT");

// views and public folder setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// form's and json data in readable formate
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express-session, cookie-parser, flash
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(cookieParser());
app.use(flash());

// routes
const indexRouter = require("./routes/index");
const hisabRouter = require("./routes/hisab");

// route middlewares
app.use("/", indexRouter);
app.use("/profile/hisab", hisabRouter);

// Error Handler middlewares
app.use((req, res, next) => {
  res.status(404).render("error", { err: "Page Not Found", status: 404 });
});
app.use((err, req, res, next) => {
  dbgr(`Unexpected error: ${err.message}`);
  res.status(err.statusCode || 500).render("error", {
    err: err.message || "Internal Server Error",
    status: 500,
  });
});

// server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  dbgr(`Server is running on http://localhost:3000`);
});
