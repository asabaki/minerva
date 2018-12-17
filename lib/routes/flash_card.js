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

router.get('/pull/:id', async (req,res) => {
  const cards = await FlashCard.findById(req.params.id);
  console.log(cards);
  res.status(200).json(cards);
})


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
    console.log(`id: ${req.params.id}`);
    console.log(req.body);
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
        $new: true
      });
    res.status(200).json({
      status: 'ok'
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
