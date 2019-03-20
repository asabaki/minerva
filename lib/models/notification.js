const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notifications: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: String,
    detail: String,
    updatedTime: Date,
    read: Boolean,

  }]
}, {timestamps: true, strict: false});


module.exports = mongoose.model('Notification', NotificationSchema);
