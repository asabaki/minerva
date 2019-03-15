const mongoose = require('mongoose');

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
      key:String,
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
    // *** LAST UPDATE FOR EDIT TIME OF QUIZ CREATOR ***
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
module.exports = mongoose.model('Note', NoteSchema);