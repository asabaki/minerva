const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const UserActivity = require('./user_activity');
const Notification = require('./notification');
const UserSchema = new mongoose.Schema({
  username: {
    type : String,
    required : true,
    unique : true
  },
  name : {
    type: String,
  },
  facebook: {
    id: String,
    token: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    name: String
  },

  password: String,
  follower : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {timestamps: true });
UserSchema.plugin(passportLocalMongoose);

UserSchema.post('save',async (doc, next) => {
  try {
    console.log(doc._id);
    const user_act = await UserActivity.create({user_id: doc._id});
    const noti = await Notification.create({user_id: doc._id});
    console.log(user_act, noti);
    next();
  } catch (e) {
    next(e);
  }
});
module.exports = mongoose.model('User', UserSchema);
