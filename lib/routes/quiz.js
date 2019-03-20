const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/users'),
  UserActivity = require('../models/user_activity'),
  Quiz = require('../models/quiz');
const credential = require('../config/CREDENTIAL');
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
router.get('/', (req, res) => {
  res.status(200).json('OK');
});


router.get('/get/all_quizzes', passport.authenticate('jwt'), async (req, res) => {
  try {
    const user = [];
    const quizzes = await Quiz.find({privacy: false});
    for (let quiz of quizzes) {
      const creator = await User.findById(quiz.user_id).select('name');
      user.push(creator.name);
    }
    // console.log(user);
    res.json({quizzes, creators: user});
  } catch (e) {
    console.log(e);
    res.json(e)
  }
});


router.get('/get/my_quizzes', passport.authenticate('jwt'), async (req, res) => {
  try {
    // console.log(req.user);
    const quizzes = await Quiz.find({user_id: req.user._id});
    res.json(quizzes);
  } catch (e) {
    res.json(e);
  }
});

router.get('/get/quiz', passport.authenticate('jwt'), async (req, res) => {
  try {
    const quizId = req.query.id;
    const quiz = await Quiz.findById(quizId);
    const creator = await User.findById(quiz.user_id).select('id name');
    if (quiz && creator) {
      res.json({quiz, creator})
    } else {
      throw new Error(`Error: Quiz not found`);
    }
  } catch (e) {
    res.json(e);
  }
});

router.get('/get/quiz_taken', passport.authenticate('jwt'), async (req, res) => {
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

router.get('/rate/:id', passport.authenticate('jwt'), async (req, res) => {
  try {
    const user_id = req.user._id;
    const id = req.params.id;
    let flag = 0;
    const collection = await Quiz.findById(id.toString());
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
router.post('/add', passport.authenticate('jwt'), async (req, res) => {
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
    if (savedQuiz) {
      const activity = await  UserActivity.findOne({user_id: req.user._id});
      if (!activity) {
        const newUserAct = new UserActivity();
        newUserAct.user_id = req.body.userId;
        newUserAct.activities.push({
          activity: 'create',
          collection_name: 'quiz',
          details:  savedQuiz._id + '/' + req.body.title  + '/' + activity.user_id ,
          updatedTime: Date.now()
        });
        const savedActivity = await newUserAct.save();
      } else {
        activity.activities.push({
          activity: 'create',
          collection_name: 'quiz',
          details: req.body.title + '/' + savedQuiz._id + '/' + activity.user_id,
          updatedTime: Date.now()
        });
        const updatedActivity = await activity.save();
      }
    }
    // console.log(savedQuiz);
    res.json(savedQuiz);
  } catch (e) {
    res.json(e);
  }
});

/* ------------------------------------------- PATCH METHOD ---------------------------------*/
router.patch('/rate', passport.authenticate('jwt'), async (req, res) => {
  const auth = req.user;
  const rateObj = {
    rater_id: auth._id,
    rating: req.body.rate
  };
  const rated_quiz = await Quiz.findById(req.body.id).lean();
  const newArr = [...rated_quiz.rater];
  const tempArr = newArr.map(r => {
    return r.rater_id
  }).filter(r => String(r) === String(auth._id));
  if (tempArr.length === 0) {
    const ratedFlash = await Quiz.findByIdAndUpdate(req.body.id, {
        $push: {
          rater: rateObj
        }
      },
      {new: true});
    const updatedQuiz = await ratedFlash.save();
    const user_name = await User.findById(updatedQuiz.user_id).select('name');
    res.json({cards: updatedQuiz, creatorName: user_name.name});
  } else {
    // IF user is already
    const ratedQuiz = await Quiz.findById(req.body.id);
    ratedQuiz.rater.forEach(rater => {
      if (String(rater.rater_id) === String(auth._id)) {
        rater.rating = req.body.rate;
      }
    });
    const updatedQuiz = await ratedQuiz.save();
    const user_name = await User.findById(updatedQuiz.user_id).select('name');
    res.json({cards: updatedQuiz, creatorName: user_name.name});
  }

});

router.patch('/unrate', passport.authenticate('jwt'), async (req, res) => {
  const auth = req.user;
  const rated_quiz = await Quiz.findById(req.body.id).lean();
  const newArr = [...rated_quiz.rater];
  const tempArr = newArr.map(r => {
    return r.rater_id
  }).filter(r => String(r) === String(auth._id));
  if (tempArr.length === 0) {
    res.status(403).json({});
  } else {
    const ratedQuiz = await Quiz.findById(req.body.id);
    let i;
    ratedQuiz.rater.forEach((rater, index) => {
      if (String(rater.rater_id) === String(auth._id)) {
        i = index;
      }
    });
    // console.log(`i = ${i}`);
    ratedQuiz.rater.splice(i, 1);
    // console.log(`rater = ${ratedFlash.rater}`);
    const updatedQuiz = await ratedQuiz.save();
    const user_name = await User.findById(updatedQuiz.user_id).select('name');
    res.status(200).json({cards: updatedQuiz, creatorName: user_name.name});
  }
})
router.patch('/add/:id', async (req, res) => {
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

router.patch('/update', passport.authenticate('jwt'), async (req,res) => {
  try {
    const quiz = await Quiz.findOneAndUpdate({_id: req.body._id}, {
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
      privacy: req.body.privacy,
      lastUpdated: Date.now(),
      $set: {
        quiz_taker: []
      }
    }, {
      new: true
    });
    if(!quiz) throw 403;
    const user = await User.findById(quiz.user_id).select('name');
    if (!quiz.privacy) {
      const activityUpdate = await UserActivity.findOneAndUpdate({user_id: user._id}, {
        $push: {
          activities: {
            activity: 'update',
            collection_name: 'quiz',
            details: quiz.title + '/' + quiz._id + '/' + user._id,
            updatedTime: Date.now()
          }
        }
      });
    }

    res.status(200).json({quiz, creator:user});

  } catch (e) {
    console.log(e);
    res.json(e);
  }
})
/* ------------------------------------------- DELETE METHOD ---------------------------------*/

router.delete('/delete/', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndRemove(req.query.id);
    res.json(quiz);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
});

router.patch('/taken/:id', passport.authenticate('jwt'), async (req, res) => {
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
    const quiz = await Quiz.findByIdAndRemove(req.query.id);
    res.json(quiz);
  } catch (e) {
    res.json(e);
    console.log(e);
  }
});

module.exports = router;
