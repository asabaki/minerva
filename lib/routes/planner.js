const express = require('express'),
  router  = express.Router(),
  passport = require('passport'),
  User = require('../models/users'),
  Planner = require('../models/planner');


/* ------------------------------------------- GET METHOD ---------------------------------*/
router.get('/', async (req,res) => {
  try {
    res.json('So far so good');
  } catch (e) {
    res.json(e);
  }
});

router.get('/get/events', passport.authenticate('jwt'), async (req,res) => {
  try {
    const events = await Planner.find({user_id: req.user._id});
    res.json(events);
    console.log(events);
  } catch (e) {
    res.json(e);
  }
});


/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add', passport.authenticate('jwt'), async (req,res) => {
  try {
    // TODO - Add Reminder
    const body = new Planner(req.body);
    body.lastUpdated = Date.now();
    body.user_id = req.user._id;
    const event = await body.save();

    console.log(event);
    res.json(event);
  } catch (e) {
    res.json(e);
  }
});

/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', passport.authenticate('jwt'), async (req,res) => {
  try {
    // console.log(req.query.id);
    const event = await Planner.findByIdAndRemove(req.query.id);
    res.json(event);
  } catch (e) {
    res.json(e)
  }
});

module.exports = router;
