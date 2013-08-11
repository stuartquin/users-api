var mongoose = require("mongoose"),
    express = require("express"),
    fs = require("fs"),
    app = express(),
    winston = require("winston");


app.configure( function(){
  app.use(express.bodyParser())
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + "/public"));
});

var setupLogger = function(){
  var logger = new (winston.Logger)({
    transports: [
      // new (winston.transports.File)({ filename: 'usersapi.log' }),
      new (winston.transports.Console)({level: "info", colorize: true, timestamp: true})
    ]
  });
  return logger;
};

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

var loadControllers = function(logger, models){
  var modules = moduleLoader("./controllers/");

  for( var name in modules ){
    var exportName = name.substr(0,1).toUpperCase() + name.substr(1);
    var controller = new modules[name][exportName](models, logger);
    assignRoutes(logger, controller);
  }
};

/**
 * Grab mongoose connection, load models
 */
var loadModels = function(logger, cb){
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
var assignRoutes = function(logger, controller){
  controller.routes.forEach(function(route){
    var path = "/" + controller.path + route.path;

    logger.info("Route: [%s] %s", route.verb, path);

    app[route.verb](path, function(req, res){
      route.handler.call(controller, req, res);
    });
  });
};

var logger = setupLogger();

loadModels(logger, function(models){
  loadControllers(logger, models);
});

var port = 3000;
app.listen(port);
logger.info("Running on %d ", port);
