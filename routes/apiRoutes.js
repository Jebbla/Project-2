var db = require("../models");

module.exports = function (app) {
  //game stuff
  var game = {
    blanksArr:[],
    category:'',
  };



  // Get all examples
  app.get("/api/startRound", function (req, res) {
    db.GameSolution.findAll({}).then(function (solutions) {
      var roundSolution = solutions[Math.floor(Math.random()*solutions.length)];
      var phrase = roundSolution.dataValues.solution.toUpperCase();
      var phraseArr = phrase.split("");
      game.category = roundSolution.dataValues.category;
      game.blanksArr = [];
      var genBlanks = function() {
        for (i = 0; i < phraseArr.length; i++) {
          game.blanksArr.push("_");
        };
        for (i = 0; i < phraseArr.length; i++) {
          switch (phraseArr[i]) {
            case " ":game.blanksArr[i] = " ";              
              break;
            case "-":game.blanksArr[i] = "-";              
              break;
            case "?":game.blanksArr[i] = "?";              
              break;
            case ",":game.blanksArr[i] = ",";              
              break;          
            default:"_";
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
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  }); 

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbExample) {
      res.json(dbExample);
    });
  });


};