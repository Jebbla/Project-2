var db = require("../models");

module.exports = function (app) {
  // Game data
  var game = {
    blanksArr: [],
    category: '',
    wheelValues: [],
    guessLog: [],
    resText: '',
    guessCorrect: null,
    players: {
      p1Score: parseInt(0),
      p2Score: parseInt(0),
      p3Score: parseInt(0)
    }
  };

  var gameBackEnd = {
    roundSolution: {},
    phrase: '',
    phraseArr: [],
    guessCorrect: null,
    fullWheel: [],
  }

  var gFunctions = {
    isWin: function () {
      if (game.blanksArr.includes("_")) {
        // No action - not a win yet
      } else {
        game.resText = "Correct guess - you win!";
      };
    },
    newGame: function () {
      game.blanksArr = [];
      game.wheelValues = [];
      game.guessLog = [];
      gameBackEnd.phraseArr = [];
      gameBackEnd.fullWheel = [];
      game.players.p1Score = parseInt(0),
        game.players.p2Score = parseInt(0),
        game.players.p3Score = parseInt(0),
        game.guessCorrect = null
    }
  }

  // Start Round request; still needs to include generating the wheel values and send to front end
  app.get("/api/startRound", function (req, res) {

    var getSolution = function () {
      db.GameSolution.findAll({}).then(function (solutions) {
        gFunctions.newGame();
        // console.log(solutions);
        gameBackEnd.roundSolution = solutions[Math.floor(Math.random() * solutions.length)];
        gameBackEnd.phrase = gameBackEnd.roundSolution.dataValues.solution.toUpperCase();
        gameBackEnd.phraseArr = gameBackEnd.phrase.split("");
        game.category = gameBackEnd.roundSolution.dataValues.category;
        game.blanksArr = [];

        for (i = 0; i < gameBackEnd.phraseArr.length; i++) {
          game.blanksArr.push("_");
        };
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
          };
        };
      });
    }

    var getWheel = function () {
      db.GameBoard.findAll({}).then(gameBoards => {
        for (i = 0; i < gameBoards.length; i++) {
          gameBackEnd.fullWheel.push(gameBoards[i].dataValues);
        };
        // console.log(gameBackEnd.fullWheel);
        for (i = 0; i < gameBackEnd.fullWheel.length; i++) {
          game.wheelValues.push(gameBackEnd.fullWheel[i].displayValue);
        };
        // console.log(game.wheelValues);
      });
    };

    getSolution();
    getWheel();

    Promise.all([getSolution, getWheel]).then(function () {
      console.log(game);
      console.log("\n\n____GAME TIME____\n");
      console.log(gameBackEnd.phrase);
      console.log(game.category);
      console.log(game.blanksArr.join(""));
      res.json(game);
    });

    // Generate the wheel values from the DB as well
  });

  // Can this value be used to determine the index of the spin?
  app.get("/api/spinWheel", function (req, res) {
    spinValue = function () {
      Math.floor(Math.random() * 24);
    }
    res.json(spinValue);
  });

  app.get("/api/processGuess/", function (req, res) {
    var guess = req.query.guess;
    if (game.guessLog.includes(guess)) {
      game.resText = "That letter has already been guessed. Try another one!"
      res.json(game);
    } else {
      game.guessLog.push(guess);
      if (gameBackEnd.phraseArr.includes(guess)) {
        gameBackEnd.guessCorrect = 1;
        game.guessCorrect = 1;
        game.resText = 'Correct guess';
        for (i = 0; i < gameBackEnd.phraseArr.length; i++) {
          if (guess === gameBackEnd.phraseArr[i]) {
            game.blanksArr[i] = guess;
            game.players.p1Score += parseInt(500);
          };
        };
        // console.log(game);
        gFunctions.isWin();
        res.json(game);
      } else {
        gameBackEnd.guessCorrect = 0;
        game.guessCorrect = 0;
        game.resText = 'Incorrect guess';
        game.players.p1Score -= parseInt(500);
        // function to lose money
        res.json(game);
      }
    }
    // integrate several functions here from the front-end JS: guessDupeNLog, guessMatch, guessRevealorLose, guessIsWin, and youWin; essentially the whole "runGame" function

  });
};