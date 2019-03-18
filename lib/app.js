const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const userRoute = require('./routes/users');
const flashRoute = require('./routes/flash_card');
const quizRoute = require('./routes/quiz');
const PlannerRoute = require('./routes/planner');
const NoteRoute = require('./routes/note');
const startRoute = require('./routes/start');
// const trendInit = require('./config/trending.init');

const dbURI = 'mongodb+srv://admindb:tm6Q3n5E4IM63HqW@minerva0-qk8sc.mongodb.net/minerva?retryWrites=true';
//|| "mongodb://localhost:27017/mean_dev_jwt_passport"
// =========================== Connect to Database ============================
mongoose.connect(dbURI, {useNewUrlParser: true, useCreateIndex: true,});
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to MongoDB Atlas');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
  // trendInit();
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
//==============================================================================
//==============================================================================
//============================= Configuration =============================
require('./config/auth.config');
app.use(require("express-session")({
  secret: "Asabaki and team",
  resave: false,
  saveUninitialized: false
}));
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
app.use('/', express.static(path.join(__dirname, 'angular')));
app.use(express.static(path.join(__dirname, 'index')));
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
app.use("/api/flash", flashRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/planner", PlannerRoute);
app.use("/api/note", NoteRoute);
app.use("/start", startRoute);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

module.exports = app;
