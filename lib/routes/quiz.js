const express = require('express'),
      router  = express.Router(),
      passport = require('passport'),
      User = require('../models/users'),
      Quiz    = require('../models/quiz');

router.get('/', (req,res) => {
  res.status(200).json('OK');
});


router.get('/get/all_quizzes', passport.authenticate('jwt'), async (req,res) => {
  try {
    const quizzes = await Quiz.find({privacy: false});
    res.json(quizzes);
  } catch (e) {
    res.json(e)
  }
});


router.get('/get/my_quizzes', passport.authenticate('jwt'), async (req,res) => {
  try {
    // console.log(req.user);
    const quizzes = await Quiz.find({user_id: req.user._id});
    res.json(quizzes);
  } catch (e) {
    res.json(e);
  }
});

router.get('/get/quiz', passport.authenticate('jwt'), async (req,res) => {
  try {
    const quizId = req.query.id;
    const quiz = await Quiz.findById(quizId);
    const creator = await User.findById(quiz.user_id).select('id name');
    if (quiz && creator) {
      console.log(quiz);
      console.log(creator);
      res.json({quiz, creator})
    } else {
      throw new Error(`Error: Quiz not found`);
    }
  } catch (e) {
    res.json(e);
  }
});

router.get('/get/quiz_taken', passport.authenticate('jwt'), async (req,res) => {
  try {
    let flag = 0;
    // GET QUIZ COLLECTION ID BY REQ.QUERY
    const user_id = req.user._id;
    const quiz = await Quiz.findById(req.query.id);

    let score;
    // quiz.quiz_taker.filter(taker => taker.user_id === user_id);

    quiz.quiz_taker.forEach(taker => {
      if (taker.user_id.toString() === user_id.toString()) {
        score = taker;
        flag = 1;
      }
    });
    // console.log(flag);
    flag === 1 ? res.json(score) : res.json(false);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});
/* ------------------------------------------- POST METHOD ---------------------------------*/
router.post('/add',passport.authenticate('jwt'), async (req,res) => {
  try {
    // console.log('Triggered');
    // console.log(req.body);
    const quiz = new Quiz({
      privacy: req.body.privacy,
      user_id: req.user._id,
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
      rating: 0,
      lastUpdated: Date.now()
    });
    const savedQuiz = await quiz.save();
    // console.log(savedQuiz);
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
/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', async (req, res) => {
  try {
    console.log(req.query.id);
    const quiz = await Quiz.findByIdAndRemove(req.query.id);
    console.log(quiz);
    res.json(quiz);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
});

router.patch('/taken/:id', passport.authenticate('jwt'), async (req,res) => {
  try {
    // console.log(req.params.id);
    const quiz = await Quiz.findById(req.params.id);
    let score;
    if (!quiz) throw new Error('Error: Quiz Not Found!');
    const taker = quiz.quiz_taker.filter(taker => taker.user_id.toString() === req.user._id.toString());
    // console.log(taker.length);
    if (taker.length === 0) {
      quiz.quiz_taker.push({
        user_id: req.user._id,
        score: req.body.score
      });
      score = quiz.quiz_taker[quiz.quiz_taker.length - 1];
    } else {
      quiz.quiz_taker.forEach(taker => {
        if (taker.user_id.toString() === req.user._id.toString()) {
          score = taker;
          taker.score = req.body.score;
        }
      });
    }
    quiz.save();
    res.json(score);
  } catch (e) {
    res.json(e);
  }
});

/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', async (req, res) => {
  try {
    console.log(req.query.id);
    const quiz = await Quiz.findByIdAndRemove(req.query.id);
    console.log(quiz);
    res.json(quiz);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
});

module.exports = router;
