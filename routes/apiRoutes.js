var db = require("../models");
// var jwt = require("jsonwebtoken");
var authenticated = 0;

module.exports = function(app) {
  // Game data that gets sent to the front end
  var game = {
    blanksArr: [],
    category: "",
    wheelValues: [],
    guessLog: [],
    resText: "",
    guessCorrect: null,
    players: {
      player1: {},
      player2: {},
      player3: {},
      p1Name: "",
      p2Name: "",
      p3Name: "",
      p1Score: parseInt(0),
      p2Score: parseInt(0),
      p3Score: parseInt(0)
    },
    spinResult: {},
    numberCorrect: null,
    vowelGuess: false,
    gameWon: false
  };

  // Hidden game data, stays on the server
  var gameBackEnd = {
    roundSolution: {},
    phrase: "",
    phraseArr: [],
    guessCorrect: null,
    fullWheel: []
  };

  var gFunctions = {
    newGame: function() {
      game.blanksArr = [];
      game.wheelValues = [];
      game.guessLog = [];
      gameBackEnd.phraseArr = [];
      gameBackEnd.fullWheel = [];
      game.resText = "Welcome to the game! Good luck!";
      game.players.p1Score = parseInt(0);
      game.players.p2Score = parseInt(0);
      game.players.p3Score = parseInt(0);
      game.guessCorrect = null;
      game.spinResult.displayValue = "";
      game.gameWon = false;
    }
  };

  // Start Round request; still needs to include generating the wheel values and send to front end
  app.get("/api/startRound", function(req, res) {
    var getSolution = function() {
      db.GameSolution.findAll({}).then(function(solutions) {
        gFunctions.newGame();
        gameBackEnd.roundSolution =
          solutions[Math.floor(Math.random() * solutions.length)];
        gameBackEnd.phrase = gameBackEnd.roundSolution.dataValues.solution.toUpperCase();
        gameBackEnd.phraseArr = gameBackEnd.phrase.split("");
        game.category = gameBackEnd.roundSolution.dataValues.category;
        game.blanksArr = [];
        for (i = 0; i < gameBackEnd.phraseArr.length; i++) {
          game.blanksArr.push("_");
        }
        for (i = 0; i < gameBackEnd.phraseArr.length; i++) {
          switch (gameBackEnd.phraseArr[i]) {
          case " ":
            game.blanksArr[i] = " ";
            break;
          case "-":
            game.blanksArr[i] = "-";
            break;
          case "?":
            game.blanksArr[i] = "?";
            break;
          case ",":
            game.blanksArr[i] = ",";
            break;
          default:
            "_";
            break;
          }
        }
      });
    };

    var getWheel = function() {
      db.GameBoard.findAll({}).then(function(gameBoards) {
        for (i = 0; i < gameBoards.length; i++) {
          gameBackEnd.fullWheel.push(gameBoards[i].dataValues);
        }
        for (i = 0; i < gameBackEnd.fullWheel.length; i++) {
          game.wheelValues.push(gameBackEnd.fullWheel[i].displayValue);
        }
      });
    };

    getSolution();

    getWheel();
    setTimeout(function() {
      res.json(game);
      console.log("\n\n____GAME TIME____\n");
      console.log(gameBackEnd.phrase);
      console.log(game.category);
      console.log(game.blanksArr.join(""));
      console.log(gameBackEnd.roundSolution.dataValues);
    }, 750);
  });

  app.get("/api/guessVowel", function(req, res) {
    if (game.players.p1Score < parseInt(500)) {
      game.resText = "Sorry, you don't have enough money right now.";
      res.json(game);
    } else {
      game.vowelGuess = true;
      game.players.p1Score -= parseInt(500);
      res.json(game);
    }
  });

  app.get("/api/spinWheel", function(req, res) {
    var spinValue = Math.floor(Math.random() * 24);
    game.spinResult = gameBackEnd.fullWheel[spinValue];
    if (game.spinResult.spaceType === "Bankrupt" && game.players.p1Score > 0) {
      game.players.p1Score = parseInt(0);
    }
    res.json(game);
    console.log("____Spin result____");
    console.log(game.spinResult);
  });

  app.get("/api/logout", function(req, res) {
    authenticated = 0;
    game.players.p1Name = "PLAYER 1";
    res.json(game);
  });

  app.post("/api/login", function(req, res) {
    db.Users.findAll({}).then(function(users) {
      console.log(req.body);
      var previouslyRegistered = false;
      for (i = 0; i < users.length; i++) {
        if (users[i].dataValues.username === req.body.username) {
          if (users[i].dataValues.password === req.body.password) {
            previouslyRegistered = true;
            game.players.player1 = users[i].dataValues;
            authenticated = 1;
            console.log(game.players);
            res.json({
              authenticated: true,
              game: game
            });
          } else {
            previouslyRegistered = true;
            res.status(401).json({});
          }
        }
      }

      if (!previouslyRegistered) {
        db.Users.create({
          username: req.body.username,
          password: req.body.password,
          totalScore: 0,
          topScore: 0,
          avgScore: 0,
          wins: 0,
          losses: 0
        }).then(function(user) {
          res.json({
            user: user
          });
        });
      }
    });
  });

  app.get("/api/processSolve", function(req, res) {
    var puzzleGuess = req.query.solveGuess;
    var solution = gameBackEnd.roundSolution.dataValues.solution;
    solution = solution.toUpperCase();
    solution = solution.replace(/-| |\?|!|[0-9]|,/g, "");
    console.log(puzzleGuess);
    console.log(solution);
    if (puzzleGuess === solution) {
      game.gameWon = true;
      game.blanksArr = gameBackEnd.phraseArr;
      game.players.p1Score += parseInt(10000);
      if (authenticated) {
        game.resText =
          "Correct guess - you win! $" +
          game.players.p1Score +
          " has been added to your total winnings! Hit 'CLICK TO START' to begin a new round!";
        db.Users.findOne({
          username: game.players.player1.username
        }).then(function() {
          db.Users.update(
            {
              totalScore: game.players.player1.totalScore + game.players.p1Score
            },
            {
              where: {
                username: game.players.player1.username
              }
            }
          ).then(function() {
            db.Users.findOne({
              username: game.players.player1.username
            }).then(function(user) {
              console.log(user.dataValues);
              game.players.player1 = user.dataValues;
              res.json(game);
            });
          });
        });
      } else {
        game.resText =
          "Correct guess - you win! Make sure to log in at the top of the page to keep track of your winnings. Hit 'CLICK TO START' to begin a new round!";
        res.json(game);
      }
    } else {
      game.players.p1Score -= parseInt(2000);
      game.resText = "Sorry, that's incorrect! The penalty is $2000.";
      res.json(game);
    }
  });

  app.get("/api/processGuess", function(req, res) {
    var guess = req.query.guess;
    game.vowelGuess = false;
    if (game.guessLog.includes(guess)) {
      game.resText = "Oh, no! That letter has already been guessed!";
      game.players.p1Score -= parseInt(game.spinResult.spaceValue);
      gameBackEnd.guessCorrect = 0;
      game.guessCorrect = 0;
      res.json(game);
    } else {
      game.guessLog.push(guess);
      game.guessLog.sort();
      if (gameBackEnd.phraseArr.includes(guess)) {
        gameBackEnd.guessCorrect = 1;
        game.guessCorrect = 1;
        game.numberCorrect = parseInt(0);
        for (i = 0; i < gameBackEnd.phraseArr.length; i++) {
          if (guess === gameBackEnd.phraseArr[i]) {
            game.blanksArr[i] = guess;
            game.numberCorrect += parseInt(1);
            game.players.p1Score += parseInt(game.spinResult.spaceValue);
          }
        }
        if (game.numberCorrect === 1) {
          game.resText = "Yes! There is one " + guess + "!";
        } else {
          game.resText =
            "Yes! There are " + game.numberCorrect + " " + guess + "s!";
        }
        console.log(game.players.p1Score);
        res.json(game);
      } else {
        gameBackEnd.guessCorrect = 0;
        game.guessCorrect = 0;
        game.resText = "Sorry, no " + guess + "s.";
        game.players.p1Score -= parseInt(game.spinResult.spaceValue);
        res.json(game);
      }
    }
  });
};
