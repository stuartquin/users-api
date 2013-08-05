var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var contactSchema = mongoose.Schema({
  email: String,
  name: String
});

exports.Contact = mongoose.model("Contact", contactSchema);
