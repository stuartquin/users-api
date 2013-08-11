var bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
  account_id: ObjectId,
  email: String,
  name: String,
  password: String,
  properties: Object
}, {strict: true});

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


exports.User = mongoose.model("User", UserSchema);
