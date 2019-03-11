const express = require('express');
const router = express.Router();
const passport = require('passport');
const FlashCard = require('../models/flash_card');
const User = require('../models/users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok'
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
    const newCollections = [...collections];
    for (let collection of collections) {
      const user = await User.findById(collection.user_id).select('name');
      users.push(user.name);
    }
    res.status(200).json({collections, users});
  } catch (e) {
    console.log(e);
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

router.get('/pull/:id', passport.authenticate('jwt'),async (req, res) => {
  const cards = await FlashCard.findById(req.params.id);
  const creator = await User.findById(cards.user_id);
  // console.log(creator.name);
  res.status(200).json({cards, creatorName: creator.name});
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
})

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
    const creator = await User.findById(req.body.userId);
    res.json({cards: save, creatorName: creator.name});
  } catch (e) {
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
    console.log(`Not rated Yet`);
    const ratedFlash = await FlashCard.findByIdAndUpdate(req.body.id, {
        $push: {
          rater: rateObj
        }
      },
      {new: true});
    const updatedFlash = await ratedFlash.save();
    const user_name = await User.findById(updatedFlash.user_id).select('name');
    res.json({quiz: updatedFlash, creatorName: user_name.name});
  } else {
    const ratedFlash = await FlashCard.findById(req.body.id);
    ratedFlash.rater.forEach(rater => {
      if (String(rater.rater_id) === String(auth._id)) {
        rater.rating = req.body.rate;
      }
    });
    const updatedFlash = await ratedFlash.save();
    const user_name = await User.findById(updatedFlash.user_id).select('name');
    res.json({quiz: updatedFlash, creatorName: user_name.name});
  }

});

router.patch('/unrate', passport.authenticate('jwt'), async (req,res) => {
  const auth = req.user;
  const rated_flash = await FlashCard.findById(req.body.id).lean();
  const newArr = [...rated_flash.rater];
  const tempArr = newArr.map(r => {
    return r.rater_id
  }).filter(r => String(r) === String(auth._id));
  if (tempArr.length === 0) {
    console.log(`Not rated Yet`);
    res.json({});
  } else {
    const ratedFlash = await FlashCard.findById(req.body.id);
    let i;
    ratedFlash.rater.forEach((rater,index) => {
      if (String(rater.rater_id) === String(auth._id)) {
        i = index;
      }
    });
    // console.log(`i = ${i}`);
    ratedFlash.rater.splice(i,1);
    // console.log(`rater = ${ratedFlash.rater}`);
    const updatedFlash = await ratedFlash.save();
    const user_name = await User.findById(updatedFlash.user_id).select('name');
    res.json({quiz: updatedFlash, creatorName: user_name.name});
  }
})

router.patch('/update', async (req, res) => {
  try {
    const update = await FlashCard.findByIdAndUpdate(req.body.id, {
      title: req.body.title,
      description: req.body.description,
      privacy: req.body.privacy,
      lastUpdate: Date.now()
    }, {new: true});
    // console.log(update);
    const creator = await User.findById(update.user_id);
    res.json({cards: update, creatorName: creator.name});
  } catch (e) {
    console.log(e);
    res.status(400).json(e)
  }
});

router.patch('/update/:id', async (req, res) => {
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
router.delete('/delete/card', async (req, res) => {
  try {
    // console.log(req.query.id);
    const card = await FlashCard.findOneAndUpdate({'card._id': req.query.id},
      {
        $pull: {card: {_id: req.query.id}},
        lastUpdate: Date.now()
      }, {
        new: true
      });
    // console.log(card.user_id);
    const creator = await User.findById(card.user_id);
    res.status(200).json({cards: card, creatorName: creator.name});
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});


module.exports = router;
