const express = require('express');
const router = express.Router();
const FlashCard = require('../models/flash_card');
const mongoose = require('mongoose');

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

router.get('/fetch/:id', async (req, res) => {
  const cards = await FlashCard.find({user_id: req.params.id});
  res.json(cards);
});

router.get('/pull/:id', async (req, res) => {
  const cards = await FlashCard.findById(req.params.id);
  res.status(200).json(cards);
});


/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add', async (req, res) => {
  // const objId = new mongoose.Types.ObjectId()
  // console.log('Hello ' + req.user);
  try {
    const newFlash = new FlashCard({
      title: req.body.title,
      description: req.body.description,
      user_id: req.body.userId
    });
    const save = await newFlash.save();
    res.json(save);
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
        }
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

router.patch('/update', async (req, res) => {
  try {
    const update = await FlashCard.findByIdAndUpdate(req.body.id, {
      title: req.body.title,
      description: req.body.description
    }, {new: true});
    res.json(update);
  } catch (e) {
    console.log(e);
    res.status(400).json(e)
  }
});

router.patch('/update/:id', async (req,res) => {
  try {
    const collection = await FlashCard.findById(req.params.id);
    const incomingUpdate = req.body;
    collection.card.forEach( (card,index) => {
      if (card._id == incomingUpdate[index].id) {
        collection.card[index].front_text = incomingUpdate[index].front_text;
        collection.card[index].back_text = incomingUpdate[index].back_text;
      }
    });
    const savedCard = await collection.save();
    res.json(savedCard);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});
/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', async (req,res) => {
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
    console.log(req.query.id);
    const card = await FlashCard.findOneAndUpdate({'card._id': req.query.id},
      {
        $pull: {card: {_id: req.query.id}}
      }, {
        new: true
      });
    console.log(card);
    res.status(200).json(card);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});


module.exports = router;
