require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
// var jwt = require("jsonwebtoken");

// var path = require("path");
// var bodyParser = require("body-parser");
var db = require("./models");
var io = require("socket.io")(server);
var server = require("http").Server(app);

var app = express();

// var PORT = process.env.PORT || 3000;
var PORT = process.env.PORT || 7000;

// var io = require('socket.io')(80);

//server.listen(4357);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
// app.get('/api/test', (req, res) => {
//   res.json({
//     message: "Welcome"
//   });
// });

// app.post('/api/posts', verifyToken, (req, res) => {
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: 'Post created',
//         authData
//       });
//     }
//   });
// });

// app.post('/api/login', (req, res) => {
//   //mock user
//   const user = {
//     id: 1,
//     username: "Raxem",
//   }
//   jwt.sign({user}, 'secretkey', (err, token) => {
//     db.Users.create({
//       username: req.body.text,
//       token: token
//     }).then(function(dbExample) {
//       res.json({
//         token
//       });
//     });
//   });
// });

//format of token
//authorizatiion: bearer <access_token>

// //verify token
// function verifyToken(req, res, next) {
// // get auth header value
// const bearerHeader = req.headers['authorization'];
// //check if bearer is undefinded
// if(typeof bearerHeader !== 'undefined') {
// //split at the space
// const bearer = bearerHeader.split(' ');
// //get token from array
// const bearerToken = bearer[1];
// //set the token
// req.token = bearerToken;
// //next middleware
// next();
// } else {
//   //forbidden
//   res.sendStatus(403);
// }
// }

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}
console.log("random");
// Starting the server, syncing our models ------------------------------------/

io.on("connection", function(socket) {
  io.emit("this", { will: "be received by everyone" });

  socket.on("private message", function(from, msg) {
    console.log("I received a private message by ", from, " saying ", msg);
  });

  socket.on("disconnect", function() {
    io.emit("user disconnected");
  });
});

module.exports = app;

db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
