const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type : String,
    required : true,
    unique : true
  },
  name : {
    type: String,
  },
  password: String,
}, {timestamps: true });
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);
