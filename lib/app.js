const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const userRoute = require('./routes/users');


// =========================== Connect to Database ============================
mongoose.connect("mongodb://localhost:27017/mean_dev_jwt_passport", {useNewUrlParser: true});
//==============================================================================
//==============================================================================
//============================= Configuration =============================
require('./config/auth.config');
//==============================================================================
// app.use(express.cookieParser());
app.use(cookieParser());
//==============================================================================
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('remember-me'));
//==============================================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use("/api/user", userRoute);

module.exports = app;
