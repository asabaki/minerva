const mongoose = require('mongoose');

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
  question: [{
    question_text: String,
    choice: [{
      choice_text: String,
      answer: Boolean
    }]
  }]
}, {timestamps: true});
module.exports = mongoose.model('Quiz', QuizSchema);
