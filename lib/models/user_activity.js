const mongoose = require('mongoose');
const UserActivitySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  activities: [{
    activity: String,
    collection_name: String,
    details: String,
    updatedTime: Date
  }]
}, {timestamps: true, strict: false});


module.exports = mongoose.model('Activity', UserActivitySchema);
