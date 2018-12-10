const express = require('express');
const router  = express.Router();
const FlashCard = require('../models/flash_card');
const mongoose = require('mongoose');

router.get('/',(req,res) => {
  res.status(200).json({
    status: 'ok'
  })
});
router.get('/fetch',async (req,res) => {
  const cards = await FlashCard.find();
  // select * from flashCard
  res.json(cards);
});

router.get('/fetch/:id',async (req,res) => {
  const cards = await FlashCard.findById(req.params.id);
  res.json(cards);
});


/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add',(req,res) => {
  // const objId = new mongoose.Types.ObjectId()
  const newFlash = new FlashCard({
    user_id: '5c04f74e0627b74fd3e6e4e0',
    card: [
      {
        front_text: 'Front Text2',
        back_text: 'BackTrack2'
      }
    ]
  });
  newFlash.save().then((card) => {
    res.json(card);
  });
});

module.exports = router;
