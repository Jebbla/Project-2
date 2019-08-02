var db = require("../models");
// var userName = document.getElementById("login-username");
// var password = document.getElementById("login-password");

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
  app.get("/users/:user/:password", function(req, res) {
    db.Users.findOne({ where: { username: req.params.user, password: req.params.password } }).then(function(
      User
    ) {
      res.render("example", {
        username: User
      });
    });
  });

// compare user input to database for password and username
// if(userName.value !== password.value){
//   console.log("correct login");
// }else{ 
//   console.log("incorrect login");
// };
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

// create a user
