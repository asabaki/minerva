const mongoose = require('mongoose');

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

module.exports = mongoose.model('FlashCard', FlashCardSchema);
