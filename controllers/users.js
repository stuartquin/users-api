var Controller = require("../base/controller").Controller;

var Users = (function() {
  function Users(models, logger) {
    this.logger = logger;
    this.path = "users";
    this.routes = [
      {verb: "get", path: "/", handler: this.get},
      {verb: "post", path: "/", handler: this.createUser},
      {verb: "post", path: "/auth", handler: this.authUser}
    ];

    this.UserModel = models.user.User;
  }
  Users.prototype = new Controller();

  Users.prototype.get = function(req, res){
    this.UserModel.find().exec(function(err, users){
      res.end(JSON.stringify(users));
    });
  };

  Users.prototype.authUser = function(req, res){
    var _that = this;
    var email = req.body.email;
    var password = req.body.password;

    this.UserModel.findOne({email: email}).exec(function(err, user){
      if (err) throw err; 
      user.comparePassword(password, function(err, match){
        if (err) throw err;
        if (match) {
        }
      });
    });
  };
  
  Users.prototype.createUser = function(req, res){
    var user = new this.UserModel(req.body);
    user.save(function(err, user){
      res.end(JSON.stringify(user.toObject()));
    });
  };

  return Users;
})();

exports.Users = Users;
