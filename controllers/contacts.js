var Contacts = (function() {
  function Contacts(models) {
    this.path = "contacts";
    this.routes = [
        {verb: "get", path: "/", handler: this.get},
        {verb: "post", path: "/", handler: this.post},
    ];

    this.ContactModel = models.contact.Contact;
  }

  Contacts.prototype.get = function(req, res){
    this.ContactModel.find().exec(function(err, contacts){
      res.end(JSON.stringify(contacts));
    });
  };
  
  Contacts.prototype.post = function(req, res){
    var contact = new this.ContactModel(req.body);
    contact.save(function(err, contact){
      console.log("Saved");
      res.end(JSON.stringify(contact.toObject()));
    });
  };

  return Contacts;
})();

exports.Contacts = Contacts;
