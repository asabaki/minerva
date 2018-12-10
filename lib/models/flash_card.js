const mongoose = require('mongoose');

const FlashCardSchema = new mongoose.Schema({
  user_id:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  card: [
    {
      front_text: String,
      back_text: String
    }
  ]
}, {timestamps: true});
module.exports = mongoose.model('FlashCard', FlashCardSchema);
