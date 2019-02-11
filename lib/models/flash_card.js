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
  ]
}, {timestamps: true, strict: false});

FlashCardSchema.pre('save', function (next) {
  let sum = 0;
  this.rater.forEach(rater => {
    sum = sum + rater.rating;
  });
  this.rating = (sum / this.rater.length).toPrecision(3);
  next();
});

module.exports = mongoose.model('FlashCard', FlashCardSchema);
