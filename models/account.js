var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Notes can be attached to a contact
var accountSchema = mongoose.Schema({
  created_at: {type: Date, default: Date.now}
});

exports.Account = mongoose.model("Account", accountSchema);
