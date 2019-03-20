const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/users'),
  Planner = require('../models/planner');


const sortByKey = (array, key) => {
  return array.sort(function (a, b) {
    const x = a[key], y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
};
/* ------------------------------------------- GET METHOD ---------------------------------*/
router.get('/', async (req, res) => {
  try {
    res.json('So far so good');
  } catch (e) {
    res.json(e);
  }
});

router.get('/get/events', passport.authenticate('jwt'), async (req, res) => {
  try {
    const events = await Planner.find({user_id: req.user._id});
    events.forEach(event => {
    });
    res.json(events);
    // console.log(events);
  } catch (e) {
    res.json(e);
  }
});

router.get('/latest/event', passport.authenticate('jwt'), async (req, res) => {
  try {
    const latest = [];
    const events = await Planner.find({user_id: req.user._id});
    if (events) {
      events.forEach(event => {
        if ((new Date(event.start) - new Date(Date.now())) > 0) {
          latest.push(event);
        }
      })
    }
    sortByKey(latest, 'start');
    res.status(200).json(latest[0]);
  } catch (e) {

  }
});

router.get('/countdowns', passport.authenticate('jwt'), async (req,res) => {
  try {
    const events = await Planner.find({user_id: req.user._id});
    const upcoming = [];
    events.forEach(event => {
      if ((new Date(event.start) - new Date(Date.now())) > 0) {
        upcoming.push(event);
      }
    });
    res.json(upcoming)
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});


/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add', passport.authenticate('jwt'), async (req, res) => {
  try {
    // TODO - Add Reminder
    const body = new Planner(req.body);
    body.lastUpdated = Date.now();
    body.user_id = req.user._id;
    const event = await body.save();

    res.json(event);
  } catch (e) {
    res.json(e);
  }
});

/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', passport.authenticate('jwt'), async (req, res) => {
  try {
    // console.log(req.query.id);
    const event = await Planner.findByIdAndRemove(req.query.id);
    res.json(event);
  } catch (e) {
    res.json(e)
  }
});

module.exports = router;
