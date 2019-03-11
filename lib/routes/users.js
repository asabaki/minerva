const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  Flash = require('../models/flash_card'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  aws = require('aws-sdk'),
  User = require('../models/users'),
  MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
  };
aws.config.update({
  secretAccessKey: 'n9Hft8dvzPCCqA6/eQ3NiWlSBGAyACaXNyFoHQsg',
  accessKeyId: 'AKIAJUFSBZ3D5UX2BKYQ',
  region: 'ap-south-1'
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'minerva-project/profile-pic',
    key: function (req, file, cb) {
      console.log(file);
      const ext = MIME_TYPE_MAP[file.mimetype];
      console.log(req.user);
      cb(null, req.user._id + '_' + Date.now() + '.' + ext); //use Date.now() for unique file keys
    }
  })
});


router.get('/', (req, res) => {
  res.redirect(req.path + 'start');
  // res.send({message: req.path, url: req.originalUrl});
});

router.get('/all/profile', (req, res) => {
  try {
    s3.listObjectsV2({Bucket: "minerva-project", MaxKeys: 10, EncodingType: 'url',}, async function (err, data) {
      try {
        console.log(data);
        if (err) throw err;
        const objKey = data.Contents
          .map(obj => obj.Key)
          .map(obj => obj.substring(12))
          .filter(obj => {
            if (obj.substring(0, 24) === '5c49d1ebd826aa35122ecd8c') return obj;
          });
        console.log(objKey);
        res.json(objKey);
      } catch (e) {
        console.log(e);
        res.json(e)
      }
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }

});

router.get('/get/tofollow', async (req, res) => {
  try {
    const user = await User.find({
      _id: {$ne: req.query.id}
    });
    res.json(user);
  } catch (e) {

  }
});

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
});

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

router.get('/profile_pic', passport.authenticate('jwt'), async (req, res) => {
  try {
    const id = req.user._id;
    s3.listObjectsV2({Bucket: "minerva-project", MaxKeys: 100, EncodingType: 'url',}, async function (err, data) {
      try {

        if (err) throw err;
        // console.log(data);
        const objKey = data.Contents
          .map(obj => obj.Key.substring(12))
          .filter(obj => obj.substring(0, 24) === String(id));
        objKey.sort();
        if (objKey.length > 0) {
          const url = await s3.getSignedUrl('getObject', {
            Bucket: 'minerva-project/profile-pic',
            Key: objKey[objKey.length - 1],
            Expires: 60
          });
          res.json(url);
        } else {
          res.json();
        }
      } catch (e) {
        console.log(e);
        res.json(e);
      }
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
    failureRedirect: '/'
  }), function (req, res) {
    const payload = {id: req.user._id};
    const token = jwt.sign(payload, 'minerva-secret', {expiresIn: '10h'});
    // console.log(`Token till here`);
    // console.log(token);
    res.redirect('../../../../../facebook?token=' + token + '&expiresIn=' + 36000 + '&id=' + req.user._id + '&name=' + req.user.name);
  }
);

router.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']}));



router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/failure'}), function (req, res) {
    const payload = {id: req.user._id};
    const token = jwt.sign(payload, 'minerva-secret', {expiresIn: '10h'});
    // console.log(`Token till here`);
    // console.log(token);
    res.redirect('../../../../../google?token=' + token + '&expiresIn=' + 36000 + '&id=' + req.user._id + '&name=' + req.user.name);
  }
);

router.get('/auth/twitter',
  passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter',{failureRedirect: '/login'}), function (req,res) {
  const payload = {id: req.user._id};
  const token = jwt.sign(payload, 'minerva-secret', {expiresIn: '10h'});
  console.log(`Token till here`);
  console.log(token);
  res.redirect('../../../../../twitter?token=' + token + '&expiresIn=' + 36000 + '&id=' + req.user._id + '&name=' + req.user.name);
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
          const token = jwt.sign(payload, 'minerva-secret', {expiresIn: '10h'});
          // console.log(req.headers);
          // console.log('Sending Response ------------------------!!!');
          return res.status(200).json(
            {
              user: user.name,
              id: user._id,
              expiresIn: 36000,
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
    res.status(202).json(e.message);
  }
});

router.post('/profile', passport.authenticate('jwt'), upload.single('image'), async (req, res) => {
  try {
    console.log(req.file);
    const url = await s3.getSignedUrl('getObject', {
      Bucket: req.file.bucket,
      Key: req.file.key,
      Expires: 60
    });
    console.log(url);
    // console.log('uploading');
    res.json(url)
  } catch (e) {
    res.json(e);
  }

});
/* ------------------------------------------- PATCH METHOD ---------------------------------*/
router.patch('/unfollow', async (req, res) => {
  try {
    // A unfollow B
    // A = req.body.follower
    // B = req.body.following
    console.log(req.body);
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
    // console.log(followedUser);
    // console.log(followerUser);
    if (followerUser && followedUser) {
      // console.log(followerUser.following);
      res.status(200).json(followerUser.following);
    } else {
      throw new Error('A did not follow B');
    }
  } catch (e) {
    console.log(e);
    res.status(202).json(e.message);
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
