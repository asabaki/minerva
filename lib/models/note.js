const mongoose = require('mongoose');
const credential = require('../config/CREDENTIAL');
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const auth = new google.auth.JWT(credential.analytic.client_email, null, credential.analytic.private_key, scopes);
const NoteSchema = new mongoose.Schema({
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
    data: {
      iv: String,
      key: String,
      encryptedData: String
    },
    views: {
      type: Number,
      default: 0
    }
    ,
    rating: Number,
    rater:
      [{
        rater_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        rating: {
          type: Number,
          default: 0
        }
      }],

    lastUpdated:
      {
        type: Date,
        require: true
      }
    ,

  },
  {
    timestamps: true
  }
  )
;

NoteSchema.pre('save', function (next) {
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

NoteSchema.post('find', async function(doc,next) {
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
    'filters': 'ga:pagePath=~/note/item/'
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
});
module.exports = mongoose.model('Note', NoteSchema);
