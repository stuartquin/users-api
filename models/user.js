var bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SALT_WORK_FACTOR = 10,
    MAX_ATTEMPTS = 5,
    LOCK_TIME = 3 * 60 * 1000; // Lock for 3 mins

var UserSchema = mongoose.Schema({
  account_id: ObjectId,
  email: String,
  name: String,
  password: String,
  properties: Object,
  created_at: {type: Date, default: Date.now},
  lock_until: Number,
  login_attempts: {type: Number, default: 0}
}, {strict: true});

var reasons = {
  NOT_FOUND: 0,
  BAD_PASSWORD: 1,
  MAX_ATTEMPTS: 2,
  LOCK_TIME: 3
};

UserSchema.pre("save", function(next){
  var _that = this;

  // Only do work if the password has changed
  if(!_that.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(_that.password, salt, function(err, hash){
      if(err) return next(err);

      _that.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.statics.authenticate = function(email, password, cb){
  this.findOne({email: email}, function(err, user){
    if (err) return cb(err);

    if (!user) {
      return cb(null, null, reasons.NOT_FOUND);
    }

    if (user.lock_until && user.lock_until > (new Date()).getTime()) {
      return cb(null, null, reasons.LOCK_TIME); 
    }

    if (user.login_attempts >= MAX_ATTEMPTS){
      user.lock_until = (new Date()).getTime() + LOCK_TIME;
      user.login_attempts = 0;
      user.save(function(err, user){
        return cb(null, null, reasons.MAX_ATTEMPTS); 
      });
    } else {
      user.comparePassword(password, function(err, match){
        if (err) return cb(err);
        if (match) {
          // Log success
          user.login_attempts = 0;
          user.lock_until = null;
          user.save(function(err, user){
            return cb(null, user);
          });
        } else {
          user.login_attempts = user.login_attempts + 1;
          user.save(function(err, user){
            return cb(null, null, reasons.BAD_PASSWORD); 
          });
        }
      });
    }
  });
};

exports.User = mongoose.model("User", UserSchema);
exports.User.AuthFailReasons = reasons;
