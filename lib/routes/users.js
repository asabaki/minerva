const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  User = require('../models/users');

router.get('/', (req, res) => {
  res.send({message: 'Hale Hydra'});
});

router.post('/signup', async (req, res, next) => {
  try {
    console.log(req.body);
    const user = new User({username: req.body.email, name: req.body.name});
    const savedUser = await User.register(user, req.body.password);
    res.status(200).json({
      emessage: 'Success! Welcome to Minerva '+ savedUser.name,
      user: savedUser.username
    });
  } catch (e) {
    res.status(400).json({
      emessage: e.message
    })
  }

  // console.log(savedUser);
});
router.post('/login', async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findByUsername(req.body.username);
    if (user) {
      console.log('Found User');
      passport.authenticate('local', {session: false}, (err, user, info) => {
        console.log({
          err, user, info
        });
        if (err) throw new Error(err);
        if (!user) {
          return res.status(401).json({
            message: info ? info.message : 'Login failed',
            user: user
          });
        }
        req.login(user, {session: false}, (err) => {
          if (err) {
            return res.send(err);
          }
          // const nw = user.toJSON();
          const payload = {id: user._id};
          const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h'});
          // console.log(req.headers);
          return res.status(200).json(
            {
              user: user.name,
              id: user._id,
              expiresIn: 3600,
              token});
        });
      })(req, res, next);
    } else {
      throw new Error('User not found!');
    }
  } catch (e) {
    res.status(401).json({
      message: e.message
    });
    console.log(e);
  }

});

router.get('/secret',passport.authenticate('jwt', {session: false}), (req,res,next) => {
  res.json({message: 'ok'});
});
module.exports = router;
