const User = require('../models/users.js'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy			= require('passport-google-oauth20').Strategy,
  TwitterStrategy			= require('passport-twitter'),
  LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;
const CREDENTIALS = require('./CREDENTIAL');

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'minerva-secret'
  },
  function (jwtPayload, cb) {

    //find the user in db if needed
    return User.findById(jwtPayload.id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
  }
));

passport.use(new GoogleStrategy({
    clientID: CREDENTIALS.google.clientID,
    clientSecret: CREDENTIALS.google.clientSecret,
    callbackURL: CREDENTIALS.google.callbackURL
  },
  (token,refreshToken,profile,done) => {
    process.nextTick(() => {
      User.findOne({ 'google.id' : profile.id },(err,user) => {
        if(err)
          return done(err);
        if(user) {
          return done(null,user);
        } else {
          const newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.name = profile.displayName;
          newUser.username = profile.emails[0].value;
          newUser.google.token = token;
          newUser.name = newUser.google.name;
          newUser.save((err) => {
            if(err) throw err;
            return done(null,newUser);
          });
        }
      });
    });
  }));


passport.use(new FacebookStrategy({
    clientID: CREDENTIALS.facebook.clientID,
    clientSecret: CREDENTIALS.facebook.clientSecret,
    callbackURL: CREDENTIALS.facebook.callbackURL,
    profileFields: CREDENTIALS.facebook.profileFields
  },
  (accessToken,refreshToken,profile,done) => {
    User.findOne({'facebook.id' : profile.id },(err,user) => {
      if (err)
        return done(err);
      // console.log("user:"+user);
      if (user) {
        return done(null,user);
      } else {
        let newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.name = profile.name.givenName+' '+profile.name.familyName;
        newUser.username = profile.emails[0].value;
        newUser.facebook.token = accessToken;
        newUser.name = newUser.facebook.name;
        newUser.save((err) => {
          if (err) throw err;
          return done(null,newUser);
        });
      }
    });


  }));

passport.use(new TwitterStrategy({
    consumerKey: CREDENTIALS.twitter.consumerKey,
    consumerSecret: CREDENTIALS.twitter.consumerSecret,
    callbackURL: CREDENTIALS.twitter.callbackURL,
    includeEmail: CREDENTIALS.twitter.includeEmail
  },
  (token,tokenSecret,profile,done) => {
    User.findOne({'twitter.id' : profile.id },(err,user) => {
      if (err)
        return done(err);
      if (user) {
        return done(null,user);
      } else {
        // var newUser = new User();
        const newUser = new User();
        newUser.twitter.id = profile.id;
        newUser.twitter.name = profile.displayName;
        newUser.username = profile.emails[0].value;
        newUser.twitter.token = token;
        newUser.name = newUser.twitter.name;
        newUser.save((err) => {
          if (err) throw err;
          return done(null,newUser);
        });
      }
    });
  }));
passport.use(User.createStrategy());
require('./init.js')(User, passport);
module.exports = passport;
