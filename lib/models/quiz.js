const mongoose = require('mongoose');
const credential = require('../config/CREDENTIAL');
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  user_id:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  privacy: {
    type: Boolean,
    default: true
  },
  questions: [{
    question_text: String,
    choice: [{
      choice_text: String,
      answer: Boolean
    }]
  }],
  quiz_taker: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number
  }],
  views: {
    type: Number,
    default: 0
  },
  rating: Number,
  rater: [{
    rater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      default: 0
    }
  }],
  // *** LAST UPDATE FOR EDIT TIME OF QUIZ CREATOR ***
  lastUpdated: {
    type: Date,
    require: true
  },

}, {timestamps: true});

QuizSchema.pre('save', function (next) {
  let sum = 0;
  this.rater.forEach(rater => {
    sum = sum + rater.rating;
  });
  if (this.rater.length > 0) {
    this.rating = (sum / this.rater.length).toPrecision(2);
  } else {
    this.rating = 0;
  }
  next();
});

QuizSchema.post('find', async function(doc,next) {
  try {
    const getGa = async (backOffTime = 2) => {
      try {
        const response = await auth.authorize();
        const view_id = '191379801';
        const result = await google.analytics('v3').data.ga.get({
          'auth': auth,
          'ids': 'ga:' + view_id,
          'metrics': 'ga:uniquePageviews',
          'dimensions': 'ga:pagePath',
          'start-date': '2019-03-12',
          'end-date': 'today',
          'sort': '-ga:uniquePageviews',
          'max-results': 100,
          'filters': 'ga:pagePath=~/quiz/item/'
        });

        const data = result.data.rows
          .map(data => {
            return {
              web: data[0],
              count: data[1]
            }
          });
        doc.forEach(async col => {
          data.map(vc => {
            if (vc.web.includes(String(col._id))) {
              col.views = vc.count;
              col.save();
            }
          })
        });
        next();
      } catch (e) {
        console.log(`Backoff for ${backOffTime} seconds`);
        backoff(backOffTime);
        getGa(backOffTime*2);
      }
    }
    getGa();
    next();
  } catch (e) {
    next(e);
  }
});

function backoff(time) {
  const randomMilli = Math.floor(Math.random() * (1000));
  let milliseconds = (time * 1000) + randomMilli;
  let start = (new Date()).getTime();
  while (((new Date()).getTime() - start) < milliseconds) {
    // do nothing
  }
}
module.exports = mongoose.model('Quiz', QuizSchema);
