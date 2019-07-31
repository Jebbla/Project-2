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
    },
    spinResult: {},
    numberCorrect: null,
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
      game.resText = 'Welcome to the game! Good luck!';
      game.players.p1Score = parseInt(0);
      game.players.p2Score = parseInt(0);
      game.players.p3Score = parseInt(0);
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
    setTimeout(function () {
      res.json(game);
      console.log("\n\n____GAME TIME____\n");
      console.log(gameBackEnd.phrase);
      console.log(game.category);
      console.log(game.blanksArr.join(""));
    }, 750);

    // Generate the wheel values from the DB as well
  });

  // Can this value be used to determine the index of the spin?
  app.get("/api/spinWheel", function (req, res) {
    var spinValue = Math.floor(Math.random() * 24);
    game.spinResult = gameBackEnd.fullWheel[spinValue];
    if (game.spinResult.spaceType === "Bankrupt" && game.players.p1Score > 0) {
      game.players.p1Score = parseInt(0);
    };
    res.json(game);
    console.log("____Spin result____");
    console.log(game.spinResult);
  });

  app.get("/api/processGuess/", function (req, res) {
    var guess = req.query.guess;
    if (game.guessLog.includes(guess)) {
      game.resText = "Oh, no! That letter has already been guessed!"
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
          };
        };
        if(game.numberCorrect === 1) {
          game.resText = 'Yes! There is one ' + guess + '!';
        } else {
          game.resText = 'Yes! There are ' + game.numberCorrect + ' ' + guess + 's!';
        };
        console.log(game.players.p1Score);
        gFunctions.isWin();
        res.json(game);
      } else {
        gameBackEnd.guessCorrect = 0;
        game.guessCorrect = 0;
        game.resText = 'Sorry, no ' + guess + 's.';
        game.players.p1Score -= parseInt(game.spinResult.spaceValue);
        // function to lose money
        res.json(game);
      }
    }

  });
};