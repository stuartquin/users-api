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

/**
 * 'require's all js files in a given directory and grab the exports.exportName
 * value
 * returns [filename(no ext)] = module
 */
var moduleLoader = function(dir){
  var files = fs.readdirSync(dir);
  var modules = {};

  files.forEach(function(file){
    if(file.substr(file.length-3) == ".js"){
      var name = file.substr(0, file.length-3);
      modules[name] = require(dir+file);
    }
  });

  return modules;
};

var loadControllers = function(app, models){
  var modules = moduleLoader("./controllers/");

  for( var name in modules ){
    var exportName = name.substr(0,1).toUpperCase() + name.substr(1);
    var controller = new modules[name][exportName](models);
    assignRoutes(controller);
  }
};

/**
 * Grab mongoose connection, load models
 */
var loadModels = function(app, cb){
  // Load Models
  mongoose.connect('mongodb://localhost/users-api');
  var db = mongoose.connection;
  db.once("open", function(){
    // Now we can load our models
    cb(moduleLoader("./models/"));
  });
};

/**
 * Setup routes based on required route object in controllers
 */
var assignRoutes = function(controller){
  controller.routes.forEach(function(route){
    var path = "/" + controller.path + route.path;

    console.log("REGISTERED ROUTE", route.verb, path);
    app[route.verb](path, function(req, res){
      route.handler.call(controller, req, res);
    });
  });
};

loadModels(app, function(models){
  console.log("Loaded ", models);
  loadControllers(app, models);
});

var port = 3000;
app.listen(port);
console.log("App started", port);
