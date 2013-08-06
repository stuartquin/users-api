var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Notes can be attached to a contact
var noteSchema = mongoose.Schema({
  content: String,
  created_at: {type: Date, default: Date.now}
});

var contactSchema = mongoose.Schema({
  email: String,
  name: String,
  notes: [noteSchema]
});

exports.Contact = mongoose.model("Contact", contactSchema);
