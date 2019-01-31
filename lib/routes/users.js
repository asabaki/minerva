const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  Flash = require('../models/flash_card'),
  User = require('../models/users');

router.get('/', (req, res) => {
  res.send({message: 'Hale Hydra'});
});
router.get('/get/tofollow', async (req,res) => {
  try {
    const user = await User.find({
      _id : { $ne: req.query.id }
    });
    res.json(user);
  } catch (e) {

  }
})
router.get('/get/follower', async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    if (user) {
      res.json(user.follower);
    } else {
      throw new Error('No User Error.');
    }
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});
router.get('/get/following', async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    if (user) {
      res.json(user.following);
    } else {
      throw new Error('No User Error.');
    }
  } catch (e) {
    console.log(e);
    res.json(e);
  }
})
router.get('/following/:follower/:following', async (req, res) => {
  const follower = req.params.follower;
  const following = req.params.following;
  // console.log(`Incoming ${follower} follows ${following}`);
  const isFollowing = await User.findById(following);
  // console.log(`Found user ${isFollowing}`);
  if (isFollowing.follower.indexOf(follower) >= 0) {
    // console.log(isFollowing.follower.indexOf(follower));
    res.json(true);
  } else {
    res.json(false);
  }
});
/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/signup', async (req, res, next) => {
  try {
    const user = new User({username: req.body.email, name: req.body.name});
    const savedUser = await User.register(user, req.body.password);
    res.status(200).json({
      emessage: 'Success! Welcome to Minerva ' + savedUser.name,
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
    const user = await User.findByUsername(req.body.username);
    if (user) {
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
          const token = jwt.sign(payload, 'minerva-secret', {expiresIn: '1h'});
          // console.log(req.headers);
          return res.status(200).json(
            {
              user: user.name,
              id: user._id,
              expiresIn: 3600,
              token
            });
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
router.post('/follow', async (req, res) => {
  try {
    // A
    const condition = {
      _id: req.body.follower,
      'following': {$ne: req.body.following}
    };
    const followerUser = await User.findOneAndUpdate(condition, {
        $push: {
          following: req.body.following
        },
      },
      {
        new: true
      });
    // B
    const condition2 = {
      _id: req.body.following,
      'follower': {$ne: req.body.follower}
    };
    const followedUser = await User.findOneAndUpdate(condition2, {
        $push: {
          follower: req.body.follower
        },
      },
      {
        new: true
      });
    if (followerUser && followedUser) {
      res.json(followerUser.following);
    } else {
      throw new Error('Already Followed Error');
    }
  } catch (e) {
    console.log(e);
    res.json(e.message);
  }
});
/* ------------------------------------------- PATCH METHOD ---------------------------------*/
router.patch('/unfollow', async (req, res) => {
  try {
    // A unfollow B
    // A = req.body.follower
    // B = req.body.following
    const conditionA = {
      _id: req.body.follower,
      'following': req.body.following
    };
    const followerUser = await User.findOneAndUpdate(conditionA, {
        $pull: {
          following: req.body.following
        },
      },
      {
        new: true
      });
    // B
    const conditionB = {
      _id: req.body.following,
      'follower': req.body.follower
    };
    const followedUser = await User.findOneAndUpdate(conditionB, {
        $pull: {
          follower: req.body.follower
        },
      },
      {
        new: true
      });
    if (followerUser && followedUser) {
      // console.log(followerUser.following);
      res.json(followerUser.following);
    } else {
      throw new Error('A did not follow B');
    }
  } catch (e) {
    console.log(e);
    res.json(e.message);
  }
});
/* ------------------------------------------- DELETE METHOD ---------------------------------*/
router.delete('/seed/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const user = await User.deleteMany({_id: {$ne: req.params.id}});
    const flash = await Flash.deleteMany();
    res.json(user);

  } catch (e) {
    console.log(e);
  }
});
router.get('/secret', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log(req.body);
  console.log(req.headers);
  console.log(req.params);
  res.json({message: 'ok'});
});
module.exports = router;
