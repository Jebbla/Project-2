var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Users.findAll({}).then(function(Users) {
      res.render("index", {
        msg: "Welcome!",
        examples: Users
      });
    });
  });

  // Load example page and pass in an example by user
  app.get("/users/:user", function(req, res) {
    db.Users.findOne({ where: { username: req.params.user } }).then(function(
      User
    ) {
      res.render("example", {
        username: User
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

// create a user
