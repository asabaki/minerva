const express = require('express'),
      router  = express.Router(),
      Quiz    = require('../models/quiz');

router.get('/', (req,res) => {
  res.status(200).json('OK');
});
/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add/', async (req,res) => {
  try {
    const quiz = new Quiz({
      title: req.body.title,
      description: req.body.description
    });
    const savedQuiz = await quiz.save();
    res.json(savedQuiz);
  } catch (e) {
    res.json(e);
  }
});

/* ------------------------------------------- PATCH METHOD ---------------------------------*/

router.patch('/add/:id', async (req,res) => {
  try {
    const question = {
      question_text: req.body.question_text,
      choice: req.body.choice
    };
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, {
      $push: {
        question: question
      }
    }, {
      new: true
    });
    res.json(quiz);
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
