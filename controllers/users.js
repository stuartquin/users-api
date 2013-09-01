var Controller = require("../base/controller").Controller;

var Users = (function() {
  function Users(models, logger) {
    this.logger = logger;
    this.path = "users";
    this.routes = [
      {verb: "get", path: "", handler: this.get},
      {verb: "get", path: "/:id", handler: this.getById},
      {verb: "post", path: "", handler: this.createUser},
      {verb: "post", path: "/auth", handler: this.authUser}
    ];

    this.UserModel = models.user.User;
  }

  Users.prototype = new Controller();

  Users.prototype.getById = function(req, res){
    var query = {};
    if( req.params.id ){
      query._id = req.params.id;
    }

    this.UserModel.findOne(query).exec(function(err, user){
      res.end(JSON.stringify(user));
    });
  };

  Users.prototype.get = function(req, res){
    this.UserModel.find().exec(function(err, users){
      var response = {users: users};
      res.end(JSON.stringify(response));
    });
  };

  Users.prototype.authUser = function(req, res){
    var _that = this;
    var email = req.body.email;
    var password = req.body.password;
    this.UserModel.authenticate(email, password, function(err, user, reason){
      if (err || (!user && reason) ){
        _that.logger.info("Login failure %s", email);
        return res.send(404, {"error": "login failure"});
      }

      return res.json(user.toObject());
    });
  };

  Users.prototype.createUser = function(req, res){
    if( !req.body.user ){
      return res.send(403, {"error": "bad data"});
    }  

    var user = new this.UserModel(req.body.user);
    user.save(function(err, user){
      res.end(JSON.stringify(user.toObject()));
    });
  };

  return Users;
})();

exports.Users = Users;
