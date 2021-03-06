const express = require('express');
const router = express.Router();
const passport = require('passport');
const FlashCard = require('../models/flash_card');
const User = require('../models/users');
const UserActivity = require('../models/user_activity');
const mongoose = require('mongoose');
const credential = require('../config/CREDENTIAL');
const jwt = require('jsonwebtoken');
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
const gaResult = async function (start, end, id) {
  const response = await auth.authorize();
  const view_id = '191379801';
  const result = await google.analytics('v3').data.ga.get({
    'auth': auth,
    'ids': 'ga:' + view_id,
    'metrics': 'ga:uniquePageviews',
    'dimensions': 'ga:pagePath',
    'start-date': start,
    'end-date': end,
    'sort': '-ga:uniquePageviews',
    'max-results': 30,
    'filters': 'ga:pagePath=~/flash/item/' + id
  });
  // console.log(result);
  const _jsonResult = await result.data.rows[0][1] || 0;
    // .map(data => data[1] || 0);
  return _jsonResult;
};
router.get('/', (req, res) => {
  res.status(200).json({
    status: formatDate(new Date(2019, 2, 15)),
    diffDays
  })
});
router.get('/fetch', async (req, res) => {
  const cards = await FlashCard.find({user_id: req.body._id});
  // select * from flashCard
  res.json(cards);
});

router.get('/fetch_all', async (req, res) => {
  try {
    const users = [];
    const collections = await FlashCard.find({privacy: false});
    for (let collection of collections) {
      const user = await User.findById(collection.user_id).select('name');
      users.push(user.name);
    }
    res.status(200).json({collections, users});
  } catch (e) {
    res.json(e);
  }

});

router.get('/fetch/:id', async (req, res) => {
  try {
    const cards = await FlashCard.find({user_id: req.params.id});
    res.json(cards);

  } catch (e) {

  }
});

router.get('/pull/:id', passport.authenticate('jwt'), async (req, res) => {
  // const result = await gaResult('2019-03-15', '2019-03-16', req.params.id);
  // console.log(result);
  const col = await FlashCard.findById(req.params.id);
  const creator = await User.findById(col.user_id);

  // console.log(creator.name);
  res.status(200).json({cards: col, creatorName: creator.name});
});

router.get('/rate/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const user_id = req.user._id;
    const id = req.params.id;
    let flag = 0;
    const collection = await FlashCard.findById(id.toString());
    collection.rater.forEach(rater => {
      if (String(rater.rater_id) === String(user_id)) {
        flag = 1;
      }
    });
    if (flag !== 1) {
      res.json(false);
    } else {
      res.json(true);
    }

  } catch (e) {
    console.log(e);
  }
});


/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add', async (req, res) => {
  // const objId = new mongoose.Types.ObjectId()
  // console.log('Hello ' + req.user);
  try {
    const newFlash = new FlashCard({
      title: req.body.title,
      description: req.body.description,
      user_id: req.body.userId,
      rating: 0,
      privacy: req.body.privacy,
      views: 0,
      lastUpdate: Date.now()
    });
    const save = await newFlash.save();
    if (save) {
      const activity = await  UserActivity.findOne({user_id: req.body.userId});
      // console.log(activity);
      if (!activity) {
        const newUserAct = new UserActivity();
        newUserAct.user_id = req.body.userId;
        newUserAct.activities.push({
          activity: 'create',
          collection_name: 'flash',
          details:  save._id + '/' + req.body.title  + '/' + activity.user_id ,
          updatedTime: Date.now()
        })
        const savedActivity = await newUserAct.save();
      } else {
        activity.activities.push({
          activity: 'create',
          collection_name: 'flash',
          details: req.body.title + '/' + save._id + '/' + activity.user_id,
          updatedTime: Date.now()
        });
        const updatedActivity = await activity.save();
      }
    }
    const creator = await User.findById(req.body.userId);
    res.json({cards: save, creatorName: creator.name});
  } catch (e) {
    console.log(e);
    res.json(e.message);
  }

});

router.post('/add/:id', async (req, res) => {
  try {
    const card = {
      front_text: req.body.front,
      back_text: req.body.back
    };
    const addCard = await FlashCard.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          card: card
        },
        lastUpdate: Date.now()
      },
      {
        new: true
      });
    res.status(200).json(addCard);
  } catch (e) {
    res.status(400).json(e);
  }
});


/* ------------------------------------------- PATCH METHOD ---------------------------------*/
router.patch('/rate', passport.authenticate('jwt'), async (req, res) => {
  const auth = req.user;
  const rateObj = {
    rater_id: auth._id,
    rating: req.body.rate
  };
  const rated_flash = await FlashCard.findById(req.body.id).lean();
  const newArr = [...rated_flash.rater];
  const tempArr = newArr.map(r => {
    return r.rater_id
  }).filter(r => String(r) === String(auth._id));
  if (tempArr.length === 0) {
    const ratedFlash = await FlashCard.findByIdAndUpdate(req.body.id, {
        $push: {
          rater: rateObj
        }
      },
      {new: true});
    const updatedFlash = await ratedFlash.save();
    const user_name = await User.findById(updatedFlash.user_id).select('name');
    res.json({cards: updatedFlash, creatorName: user_name.name});
  } else {
    const ratedFlash = await FlashCard.findById(req.body.id);
    ratedFlash.rater.forEach(rater => {
      if (String(rater.rater_id) === String(auth._id)) {
        rater.rating = req.body.rate;
      }
    });
    const updatedFlash = await ratedFlash.save();
    const user_name = await User.findById(updatedFlash.user_id).select('name');
    res.json({cards: updatedFlash, creatorName: user_name.name});
  }

});

router.patch('/unrate', passport.authenticate('jwt'), async (req, res) => {
  const auth = req.user;
  const rated_flash = await FlashCard.findById(req.body.id).lean();
  const newArr = [...rated_flash.rater];
  const tempArr = newArr.map(r => {
    return r.rater_id
  }).filter(r => String(r) === String(auth._id));
  if (tempArr.length === 0) {
    res.json({});
  } else {
    const ratedFlash = await FlashCard.findById(req.body.id);
    let i;
    ratedFlash.rater.forEach((rater, index) => {
      if (String(rater.rater_id) === String(auth._id)) {
        i = index;
      }
    });
    // console.log(`i = ${i}`);
    ratedFlash.rater.splice(i, 1);
    // console.log(`rater = ${ratedFlash.rater}`);
    const updatedFlash = await ratedFlash.save();
    const user_name = await User.findById(updatedFlash.user_id).select('name');
    res.json({cards: updatedFlash, creatorName: user_name.name});
  }
})

router.patch('/update', passport.authenticate('jwt'), async (req, res) => {
  try {
    const update = await FlashCard.findByIdAndUpdate(req.body.id, {
      title: req.body.title,
      description: req.body.description,
      privacy: req.body.privacy,
      lastUpdate: Date.now()
    }, {new: true});
    // console.log(update);
    if (update) {
      const activity = await  UserActivity.findOne({user_id: req.user._id});
      // console.log(activity);
      if (!activity) {
        const newUserAct = new UserActivity();
        newUserAct.user_id = req.user._id;
        newUserAct.activities.push({
          activity: 'update',
          collection_name: 'flash',
          details:  req.body.title + '/' + update._id  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const savedActivity = await newUserAct.save();
      } else {
        activity.activities.push({
          activity: 'update',
          collection_name: 'flash',
          details:  req.body.title + '/' + update._id  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const updatedActivity = await activity.save();
      }
    }
    const creator = await User.findById(update.user_id);
    res.json({cards: update, creatorName: creator.name});
  } catch (e) {
    console.log(e);
    res.status(400).json(e)
  }
});

router.patch('/update/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const collection = await FlashCard.findById(req.params.id);
    const incomingUpdate = req.body;
    collection.card.forEach((card, index) => {
      if (card._id == incomingUpdate[index].id) {
        collection.card[index].front_text = incomingUpdate[index].front_text;
        collection.card[index].back_text = incomingUpdate[index].back_text;
      }
    });
    collection.lastUpdate = Date.now();
    const savedCard = await collection.save();
    if (savedCard) {
      const activity = await  UserActivity.findOne({user_id: req.user._id});
      // console.log(activity);
      if (!activity) {
        const newUserAct = new UserActivity();
        newUserAct.user_id = req.user._id;
        newUserAct.activities.push({
          activity: 'update',
          collection_name: 'flash',
          details:  req.body.title + '/' + savedCard._id  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const savedActivity = await newUserAct.save();
      } else {
        activity.activities.push({
          activity: 'update',
          collection_name: 'flash',
          details:  req.body.title + '/' + savedCard._id  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const updatedActivity = await activity.save();
      }
    }
    const creator = await User.findById(savedCard.user_id);
    res.json({cards: savedCard, creatorName: creator.name});
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});
/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', async (req, res) => {
  try {
    // console.log(req.query.id);
    const card = await FlashCard.findByIdAndRemove(req.query.id);
    res.json(card);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
})
router.delete('/delete/card',passport.authenticate('jwt'), async (req, res) => {
  try {
    // console.log(req.query.id);
    const card = await FlashCard.findOneAndUpdate({'card._id': req.query.id},
      {
        $pull: {card: {_id: req.query.id}},
        lastUpdate: Date.now()
      }, {
        new: true
      });
    if (card) {
      const activity = await  UserActivity.findOne({user_id: req.user._id});
      // console.log(activity);
      if (!activity) {
        const newUserAct = new UserActivity();
        newUserAct.user_id = req.user._id;
        newUserAct.activities.push({
          activity: 'update',
          collection_name: 'flash',
          details:  req.body.title + '/' + card._id  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const savedActivity = await newUserAct.save();
      } else {
        activity.activities.push({
          activity: 'update',
          collection_name: 'flash',
          details:  req.body.title + '/' + card._id  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const updatedActivity = await activity.save();
      }
    }
    // console.log(card.user_id);
    const creator = await User.findById(card.user_id);
    res.status(200).json({cards: card, creatorName: creator.name});
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

module.exports = router;
