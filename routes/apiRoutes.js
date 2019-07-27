var db = require("../models");

module.exports = function (app) {
  // Game data
  var game = {
    blanksArr: [],
    category: '',
    wheelValues:[],
  };

  // Start Round request; still needs to include generating the wheel values and send to front end
  app.get("/api/startRound", function (req, res) {
    db.GameSolution.findAll({}).then(function (solutions) {
      var roundSolution = solutions[Math.floor(Math.random() * solutions.length)];
      var phrase = roundSolution.dataValues.solution.toUpperCase();
      var phraseArr = phrase.split("");
      game.category = roundSolution.dataValues.category;
      game.blanksArr = [];
      var genBlanks = function () {
        for (i = 0; i < phraseArr.length; i++) {
          game.blanksArr.push("_");
        };
        for (i = 0; i < phraseArr.length; i++) {
          switch (phraseArr[i]) {
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
      };
      genBlanks();
      console.log("\n\n____GAME TIME____\n");
      console.log(phrase);
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

  app.get("/api/processGuess", function (req, res) {
    // integrate several functions here from the front-end JS: guessDupeNLog, guessMatch, guessRevealorLose, guessIsWin, and youWin; essentially the whole "runGame" function
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Users.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  
  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Users.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });


};