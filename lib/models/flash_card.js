const mongoose = require('mongoose');
const credential = require('../config/CREDENTIAL');
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
const FlashCardSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  privacy: Boolean,
  views: Number,
  card: [
    {
      front_text: String,
      back_text: String
    }
  ],
  lastUpdate: {
    type: Date,
    require: true
  }
}, {timestamps: true, strict: false});

FlashCardSchema.pre('save', function (next) {
  let sum = 0;
  if (this.rater) {
    this.rater.forEach(rater => {
      sum = sum + rater.rating;
    });
    this.rating = (sum / this.rater.length).toPrecision(2);
  } else {
    this.rating = 0;
  }
  next();
});
FlashCardSchema.post('find', async function(doc,next) {
  try {
    backoff(2);
    const getGa = async (backoffTime = 2) => {
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
          'filters': 'ga:pagePath=~/flash/item/'
        });

        const data = result.data.rows
          .map(data => {
            return {
              web: data[0],
              count: data[1]
            }
          });
        doc.forEach(col => {
          data.map(vc => {
            if (vc.web.includes(String(col._id))) {
              col.views = vc.count;
              col.save();
            }
          })
        });
      } catch (e) {
        console.log(`Backoff for ${backoffTime} seconds`);
        backoff(backoffTime);
        getGa(backoffTime*2)
      }
    }
    getGa();


  } catch (e) {
    console.log(e);
    next(e);
  } finally {
    next();
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

module.exports = mongoose.model('FlashCard', FlashCardSchema);
