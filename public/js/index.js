/* eslint-disable no-unused-vars */
// Get references to page elements
var $loginUsername = $("#login-username");
var $loginPassword = $("#login-password");
var $loginButton = $("#login-button");
var $exampleList = $("#example-list");
var $theWord = $("#the-word");
var $commentary = $("#commentary");
var $currentGuess = $("#current-guess");
var $submitGuess = $("#submit-guess");
var $roundGuesses = $("#round-guesses");
var $puzzleGuess = $("#puzzle-guess-value");
var $solveChoice = $("#solve-choice");
var $solveSubmit = $("#solve-submit");
var $solveArea = $("#solve-area");
var $vowelChoice = $("#vowel-choice");
var $spinChoice = $("#spin-choice");
var $p1StartRound = $("#p1start-round");
var $p2StartRound = $("#p2start-round");
var $p3StartRound = $("#p3start-round");
var $roundCategory = $("#round-category");
var $exampleText = $("#example-text");
var $loginHighscore = $("#login-highscore");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    var token = localStorage.getItem("triviaToken");
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "my token goes here"
      },
      statusCode: {
        401: function() {
          alert("BAD PASSWORD!");
        }
      },
      type: "POST",
      url: "api/login",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  },
  startRound: function() {
    return $.ajax({
      url: "api/startRound",
      type: "GET"
    }).then(function(res) {
      $roundCategory.text(res.category);
      $commentary.text(res.resText);
      $theWord.text(res.blanksArr.join(""));
      $p1Score.text(0);
      $p2Score.text(0);
      $p3Score.text(0);
      $solveChoice.show();
      $spinChoice.show();
      $theWord.show();
      $wheel.show();
      $roundGuesses.show();
      $roundGuesses.text(res.guessLog.join(" "));
      $wheel.text(res.spinResult.displayValue);
      console.log(res);
    });
  },
  spinWheel: function() {
    return $.ajax({
      url: "api/spinWheel",
      type: "GET"
    }).then(function(res) {
      $wheel.text(res.spinResult.displayValue);
      if (res.spinResult.spaceType === "Bankrupt") {
        $p1Score.text(res.players.p1Score);
        $commentary.text("BANKRUPT! Major bummer!");
        $spinChoice.show();
        $solveChoice.show();
      } else {
        $commentary.text("Enter your guess!");
        $submitGuess.show();
        $currentGuess.show();
        $solveChoice.hide();
        $spinChoice.hide();
        document.getElementById("current-guess").value = "";
        document.querySelector("#current-guess").focus();
      }
    });
  },

  guessVowel: function() {
    return $.ajax({
      url: "api/guessVowel",
      type: "GET"
    }).then(function(res) {
      vowelGuess = res.vowelGuess;
      $vowelChoice.hide();
      $solveChoice.hide();
      $spinChoice.hide();
      $currentGuess.show();
      $submitGuess.show();
      document.getElementById("current-guess").value = "";
      document.querySelector("#current-guess").focus();
    });
  },

  submitGuess: function(guess) {
    guess = guess.toUpperCase();
    return $.ajax({
      url: "api/processGuess",
      data: {
        guess: guess
      },
      type: "GET"
    }).then(function(res) {
      console.log(res);
      vowelGuess = res.vowelGuess;
      $roundCategory.text(res.category);
      $theWord.text(res.blanksArr.join(""));
      $roundGuesses.text(res.guessLog.join(" "));
      $commentary.text(res.resText);
      if (res.guessCorrect && res.players.p1Score >= 500) {
        $vowelChoice.show();
      } else {
        $vowelChoice.hide();
      }
      $solveChoice.show();
      $submitGuess.hide();
      $currentGuess.hide();
      $spinChoice.show();
      $p1Score.text(res.players.p1Score);
      $p2Score.text(res.players.p2Score);
      $p3Score.text(res.players.p3Score);
    });
  },

  submitSolve: function(solveGuess) {
    solveGuess = solveGuess.toUpperCase();
    solveGuess = solveGuess.replace(/-| |\?|!|[0-9]|,/g, "");
    return $.ajax({
      url: "api/processSolve",
      data: {
        solveGuess: solveGuess
      },
      type: "GET"
    }).then(function(res) {
      console.log(res);
      $p1Score.text(res.players.p1Score);
      $commentary.text(res.resText);
      if (res.gameWon) {
        $solveArea.hide();
        $roundGuesses.hide();
        $theWord.text(res.blanksArr.join(""));
        $p1StartRound.show();
      } else {
        //lose
        $solveArea.hide();
        $spinChoice.show();
        $solveChoice.show();
        $wheel.show();
      }
      document.getElementById("puzzle-guess-value").value = "";
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.username)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    username: $loginUsername.val().trim(),
    password: $loginPassword.val().trim(),
    score: $loginHighscore.val().trim()
  };

  if (!(example.username && example.password)) {
    alert("You must enter a username, password");
    return;
  }

  API.saveExample(example).then(function(data, ) {
    if(data) {
      localStorage.setItem("triviaToken", data.token);
    }
    // refreshExamples();
  });

  $loginUsername.val("");
  $loginPassword.val("");
  $loginHighscore.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// EVENT LISTENERS
$loginButton.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
$startRound.on("click", function() {
  API.startRound();
  $startRound.hide();
});

/*******************************************Adam's jQuery code */
/*******************************************Adam's jQuery code */

// var possibleSolutions = ["plastic storage containers"];
var goodComments = [
  "Yes, there are X of that letter! $xxx is added to your score."
];
var badComments = ["Sorry, none of that letter. You lose $xxx."];
var roundSolution = [];
var roundSolutionBlanks = [];
var guessCorrect = null;
var guessLetter = null;
var win = 0;
var guessesLog = [];
var guessDupe = 0;
var category = "";

//// FUNCTIONS FOR PREPPING THE ROUND
var freshRound = function() {
  // roundSolution = [];
  // roundSolutionBlanks = [];
  guessLetter = null;
  guessCorrect = null;
  guessesLog.length = 0;
  // $(".commentary").text("Enter a letter into the box on the left, then click on the 'Submit Guess' button to get started!");
};

var getSolution = function() {
  // word = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)]
  // word = word.toUpperCase();
  // roundSolution = word.split("");
  // console.log("Round solution chosen: " + roundSolution + " (" + roundSolution.length + " letters)")
};

var genBlanks = function() {
  // for (i = 0; i < roundSolution.length; i++) {
  // roundSolutionBlanks.push("_");
  // }
  // Reveal spaces
  // for (i = 0; i < roundSolution.length; i++) {
  // if (" " === roundSolution[i]) {
  // roundSolutionBlanks[i] = " ";
  // $theWord.text(roundSolutionBlanks.join(""));
  // }
  // }
  // $theWord.text(roundSolutionBlanks.join(""));
};

//// FUNCTIONS FOR EACH USER GUESS

var guessDupeNLog = function() {
  console.log("Guessed letter: " + guessLetter);
  if (guessesLog.includes(guessLetter)) {
    $(".commentary").text(
      "Hold up there, chief. You already guessed that letter!"
    );
    guessDupe = 1;
    eraseText();
  } else {
    guessesLog.push(guessLetter);
    guessDupe = 0;
    $roundGuesses.text(guessesLog.join(" "));
  }
  console.log("Guess Log: " + guessesLog);
};

var guessMatch = function() {
  if (roundSolution.includes(guessLetter)) {
    guessCorrect = 1;
  } else {
    guessCorrect = 0;
    var badCommentPick = Math.floor(Math.random() * badComments.length);
    $(".commentary").text(badComments[badCommentPick]);
  }
};

var guessRevealOrLose = function() {
  if (guessCorrect === 1) {
    for (i = 0; i < roundSolution.length; i++) {
      if (guessLetter === roundSolution[i]) {
        roundSolutionBlanks[i] = guessLetter;
        $theWord.text(roundSolutionBlanks.join(""));
      }
    }
    var goodCommentPick = Math.floor(Math.random() * goodComments.length);
    $(".commentary").text(goodComments[goodCommentPick]);
  } else {
    // No action
  }
};

var eraseText = function() {
  $currentGuess.value = "";
};

//// WIN CHECK

var guessIsWin = function() {
  if (roundSolutionBlanks.includes("_")) {
    // No action; not a win yet.
  } else {
    youWin();
  }
};

//// USER WINS

var youWin = function() {
  win = 0;
  // Replace this alert, don't restart round until a restart button is pushed
  $submitGuess.prop("disabled", true);
  $(".commentary").text(
    "Yeah! You win! Hit the 'Start a New Game' button to play again."
  );
  // Disable the submit button until new round starts
};

//////////// Actual stuff -happening- /////////////////

// New Game Setup

var gameSetup = function() {
  freshRound();
  // getSolution();
  // genBlanks();
  // turnsLeft = 6; // Sorry, not drawing a head, body, two arms, two legs :(
  $submitGuess.prop("disabled", false);
  $theWord.text(roundSolutionBlanks.join(""));
  $roundGuesses.text(guessesLog.join(" "));
};

// Control for the text field - only allow letters (no symbols or numbers)
$("#current-guess").onkeyup = function(event) {
  this.value = this.value.replace(/[^a-zA-Z]/gi, "");
};

// Functions for each guess submitted - main cycle
var runGame = function() {
  guessLetter = $currentGuess.val();
  guessLetter = guessLetter.toUpperCase();
  guessDupeNLog();
  if (guessDupe === 0) {
    guessMatch();
    guessRevealOrLose();
    eraseText();
    guessIsWin();
  }
};
//if (username === username.val() && password.val() === password) {
  //runGame(); //api/startgame
//} else {
 // alert("username already taken or password incorrect, oops!");
//}

$("#current-guess").keydown(function(e) {
  // Only allow delete, backspace, enter:
  if ($.inArray(e.keyCode, [8, 46]) !== -1) {
    return;
  }
  // Restrict entries based on whether the current guess is supposed to be a vowel:
  if (
    vowelGuess === true &&
    $.inArray(e.keyCode, [65, 69, 73, 79, 85]) === -1
  ) {
    e.preventDefault();
  } else if (
    vowelGuess === false &&
    $.inArray(e.keyCode, [
      66,
      67,
      68,
      70,
      71,
      72,
      74,
      75,
      76,
      77,
      78,
      80,
      81,
      82,
      83,
      84,
      86,
      87,
      88,
      89,
      90
    ]) === -1
  ) {
    e.preventDefault();
  }
});

$(document).on("keypress", function(e) {
  if (e.which == 13) {
    runGame();
  }
});
