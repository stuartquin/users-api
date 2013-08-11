var Controller = require("../base/controller").Controller;

var Users = (function() {
  function Users(models) {
    this.path = "users";
    this.routes = [
      {verb: "get", path: "/", handler: this.get},
      {verb: "post", path: "/", handler: this.create_user}
    ];

    this.UserModel = models.user.User;
  }
  Users.prototype = new Controller();

  Users.prototype.get = function(req, res){
    this.UserModel.find().exec(function(err, users){
      res.end(JSON.stringify(users));
    });
  };
  
  Users.prototype.create_user = function(req, res){
    var user = new this.UserModel(req.body);
    user.save(function(err, user){
      res.end(JSON.stringify(user.toObject()));
    });
  };

  return Users;
})();

exports.Users = Users;
