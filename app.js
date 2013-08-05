var mongoose = require("mongoose");
var express = require("express");
var fs = require("fs");
var app = express();

app.configure( function(){
 app.use(express.bodyParser())
 app.use(express.methodOverride());
 app.use(app.router);
 app.use(express.static(__dirname + "/public"));
});

var loadControllers = function(app, models){
  // Load Controllers
  // To be generalised...
  var Contacts = require("./controllers/contacts.js").Contacts;

  var contacts = new Contacts(models);
  contacts.routes.forEach(function(route){
    var path = "/" + contacts.path + route.path;

    app[route.verb](path, function(req, res){
      route.handler.call(contacts, req, res);
    });
  });
};

// Load Models
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.once("open", function(){
  // Now we can load our models
  var models = {};
  models["contact"] = require("./models/contact").Contact;
  loadControllers(app, models);
});



app.listen(3000);
