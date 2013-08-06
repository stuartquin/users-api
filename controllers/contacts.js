var Controller = require("../base/controller").Controller;

var Contacts = (function() {
  function Contacts(models) {
    this.path = "contacts";
    this.routes = [
      {verb: "get", path: "/", handler: this.get},
      {verb: "post", path: "/", handler: this.create_contact},
      {verb: "post", path: "/:email/note/", handler: this.create_note},
    ];

    this.ContactModel = models.contact.Contact;
  }
  Contacts.prototype = new Controller();

  Contacts.prototype.get = function(req, res){
    this.ContactModel.find().exec(function(err, contacts){
      res.end(JSON.stringify(contacts));
    });
  };
  
  Contacts.prototype.create_contact = function(req, res){
    var contact = new this.ContactModel(req.body);
    contact.save(function(err, contact){
      res.end(JSON.stringify(contact.toObject()));
    });
  };

  Contacts.prototype.create_note = function(req, res){
    var email = req.params.email;
    var content = req.body.content;

    this.ContactModel.findOne({email: email}, function(err, contact){
      contact.notes.push({content: content});
      contact.save(function(err, contact){
        res.end(JSON.stringify(contact.toObject()));
      });
    });
  };

  return Contacts;
})();

exports.Contacts = Contacts;
