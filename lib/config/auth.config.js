const User = require('../models/users.js'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

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
// passport.use(new RememberMeStrategy(
//   function(token, done) {
//     Token.consume(token, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user);
//     });
//   },
//   function(user, done) {
//     var token = utils.generateToken(64);
//     Token.save(token, { userId: user.id }, function(err) {
//       if (err) { return done(err); }
//       return done(null, token);
//     });
//   }
// ));
passport.use(User.createStrategy());
require('./init.js')(User, passport);
module.exports = passport;
