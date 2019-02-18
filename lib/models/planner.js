const mongoose = require('mongoose');

const PlannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  user_id:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date
  },
  color: String,
  // *** LAST UPDATE FOR EDIT TIME OF QUIZ CREATOR ***
  lastUpdated: {
    type: Date,
    required: true
  },

}, {timestamps: true});

// QuizSchema.pre('save',function (next) {
//   console.log('Save triggered');
//   let sum = 0;
//   this.rater.forEach(rater => {
//     sum = sum + rater.rating;
//   });
//   this.rating = (sum / this.rater.length).toPrecision(3);
//   next();
// });
module.exports = mongoose.model('Planner', PlannerSchema);
