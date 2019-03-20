const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  Flash = require('../models/flash_card'),
  UserActivity = require('../models/user_activity'),
  Notification = require('../models/notification'),
  Quiz = require('../models/quiz'),
  Note = require('../models/note'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  aws = require('aws-sdk'),
  User = require('../models/users'),
  credential = require('../config/CREDENTIAL'),
  MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
  };
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
aws.config.update({
  secretAccessKey: 'n9Hft8dvzPCCqA6/eQ3NiWlSBGAyACaXNyFoHQsg',
  accessKeyId: 'AKIAJUFSBZ3D5UX2BKYQ',
  region: 'ap-south-1'
});
const sortByKey = (array, key) => {
  return array.sort(function (a, b) {
    const x = a[key], y = b[key];
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
};
const stdDevia = function (arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b) / n;
  const s = Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
  return s;
};

const zscore = function (obs, arr) {
  const sum = arr.reduce((a, b) => a + (b || 0), 0);
  const std = stdDevia(arr);
  console.log(sum, std);
  const number = arr.length;
  const avg = sum / number;
  return (obs - avg) / std
};

//AIzaSyBldZdMOlwCirQlXFRS8YZRsZXMLfOA0EY

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'minerva-project/profile-pic',
    key: function (req, file, cb) {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, req.user._id + '_' + Date.now() + '.' + ext); //use Date.now() for unique file keys
    }
  })
});


router.get('/', async (req, res) => {
  try {
    const response = await auth.authorize();
    const view_id = '191379801';
    const result = await google.analytics('v3').data.ga.get({
      'auth': auth,
      'ids': 'ga:' + view_id,
      'metrics': 'ga:uniquePageviews',
      'dimensions': 'ga:pagePath',
      'start-date': '2019-03-12',
      'end-date': '2019-03-13',
      'sort': '-ga:uniquePageviews',
      'max-results': 30,
      'filters': 'ga:pagePath=~/flash/item/5c6adbec5838111c957e135e'
    });
    // console.log(result);

    // const data = result.data.rows.map(data => {
    //   return {
    //     web: data[0] || 'none',
    //     count: data[1] || 0
    //   }
    // });
    res.json({result});
    // console.log(auth);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.get('/all/profile', (req, res) => {
  try {
    s3.listObjectsV2({Bucket: "minerva-project", MaxKeys: 10, EncodingType: 'url',}, async function (err, data) {
      try {
        if (err) throw err;
        const objKey = data.Contents
          .map(obj => obj.Key)
          .map(obj => obj.substring(12))
          .filter(obj => {
            if (obj.substring(0, 24) === '5c49d1ebd826aa35122ecd8c') return obj;
          });
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
    const id = req.query.id;
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
          res.status(200).json(url);
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
    res.status(403).json(e);
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

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/login'}), function (req, res) {
  const payload = {id: req.user._id};
  const token = jwt.sign(payload, 'minerva-secret', {expiresIn: '10h'});
  res.redirect('../../../../../twitter?token=' + token + '&expiresIn=' + 36000 + '&id=' + req.user._id + '&name=' + req.user.name);
});

router.get('/trending_user', async (req, res) => {
  try {
    const users = {};
    const top_users = [];
    const user_all = await User.find().select('id');
    user_all.forEach(user => {
      users[user._id] = 0;
    });
    const flash = await Flash.find().sort({user_id: -1});
    flash.forEach(col => users[col.user_id] += col.rating);
    const quiz = await Quiz.find().sort({user_id: -1});
    quiz.forEach(quest => users[quest.user_id] += quest.rating);
    const notes = await Note.find().sort({user_id: -1});
    notes.forEach(note => users[note.user_id] += note.rating);
    const props = Object.keys(users).map(function (key) {
      return {key: key, value: this[key]};
    }, users);
    props.sort(function (p1, p2) {
      return p2.value - p1.value;
    });
    const topThree = props.slice(0, 3);
    for (let usr of topThree) {
      const user = await User.findById(String(usr.key)).select('name');
      top_users.push({
        id: user._id,
        name: user.name,
        followed: false
      });
    }
    const this_user = await User.findById(req.query.id);
    top_users.forEach(user => {
      if (this_user.following.indexOf(user.id) > 0) {
        user.followed = true;
      }
    });
    // console.log(this_user);
    res.json(top_users);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.get('/trending_works', passport.authenticate('jwt'), async (req, res) => {
  try {
    const notes = await Note.find({privacy: false});
    const quizzes = await Quiz.find({privacy: false});
    const flashcards = await Flash.find({privacy: false});
    sortByKey(notes, 'views');
    sortByKey(quizzes, 'views');
    sortByKey(flashcards, 'views');
    const noteCreator = await User.findById(notes[0].user_id).select('name');
    const quizCreator = await User.findById(quizzes[0].user_id).select('name');
    const flashCreator = await User.findById(flashcards[0].user_id).select('name');
    res.json({
      note: {
        data: notes[0],
        author: noteCreator.name
      },
      quiz: {
        data: quizzes[0],
        author: quizCreator.name
      },
      flashcard: {
        data: flashcards[0],
        author: flashCreator.name
      }
    })


  } catch (e) {
    console.log(e);
    res.json(e);
  }
})

router.get('/feeds', passport.authenticate('jwt'), async (req, res) => {
  try {
    const activities = [];
    const user_this = await User.findById(req.user._id);
    for (let user of user_this.following) {
      if (!user) ;
      else {
        const userAct = await UserActivity.findOne({user_id: user});
        const name = await User.findById(user).select('name');
        userAct.activities.forEach(activity => {
          const diff = Math.floor(Math.abs(new Date(activity.updatedTime).getTime() - new Date(Date.now()).getTime()) / (1000 * 60));
          if (diff < 10080) {
            activities.push({
              activity,
              name: name.name
            });
          }
        });
      }
    }
    res.status(200).json(activities);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.get('/get_noti', passport.authenticate('jwt'), async (req, res) => {
  try {
    const notification = await Notification.findOne({user_id: req.user._id});
    if (!notification) throw 403;
    const unread = [...notification.notifications.filter(noti => noti.read === false)];
    res.status(200).json(unread)
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.get('/test/create/notification', async (req, res) => {
  try {
    const users = await User.find();
    users.forEach(async user => {
      const Tracker = await Notification.findOne({user_id: user._id});
      if (!Tracker) {
        const createTracker = await Notification.create({
          user_id: user._id
        });
        console.log(createTracker);
      }
    })
  } catch (e) {
    res.json(e);
  }
})
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
        // console.log({
        //   err, user, info
        // });
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
    const url = await s3.getSignedUrl('getObject', {
      Bucket: req.file.bucket,
      Key: req.file.key,
      Expires: 60
    });
    // console.log('uploading');
    res.json(url)
  } catch (e) {
    res.json(e);
  }

});

router.post('/update', passport.authenticate('jwt'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: req.body.f + ' ' + req.body.l
    }, {
      new: true
    });
    res.status(200).json(user.name);
  } catch (e) {
    res.json(e);
    console.log(e);
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

router.patch('/change/password', passport.authenticate('jwt'), async (req, res) => {
  try {
    const passwordDetails = req.body;
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        const response = await user.changePassword(passwordDetails.c, passwordDetails.p);
        res.status(200).json(response);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: e.message
    })
  }
});

router.patch('/read_noti', passport.authenticate('jwt'), async (req, res) => {
  try {
    const notification = await Notification.findOne({user_id: req.user._id});
    notification.notifications.forEach(noty => noty.read = true);
    const newNotification = await notification.save();
    console.log(newNotification);
    res.status(200).json(notification)

  } catch (e) {
    console.log(e);
    res.json(e)
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
