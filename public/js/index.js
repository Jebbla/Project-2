// Get references to page elements
var $usernameLabel = $("#username-label");
var $passwordLabel = $("#password-label");
var $loginUsername = $("#login-username");
var $loginPassword = $("#login-password");
var $loginButton = $("#login-button");
var $logoutButton = $("#logout-button");
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
var $p1Name = $("#p1-name");
var $p2Name = $("#p2-name");
var $p3Name = $("#p3-name");
var $p1Winnings = $("#p1-winnings");
var $p2Winnings = $("#p2-winnings");
var $p3Winnings = $("#p3-winnings");
var $p1WinningsTag = $("#p1-winnings-tag");
var $p2WinningsTag = $("#p2-winnings-tag");
var $p3WinningsTag = $("#p3-winnings-tag");
var $roundCategory = $("#round-category");
var $p1Score = $("#p1-score");
var $p2Score = $("#p2-score");
var $p3Score = $("#p3-score");
var $wheel = $("#wheel");
var vowelGuess = false;
var $exampleText = $("#example-text");
var $loginHighscore = $("#login-highscore");

// The API object contains methods for each kind of request we'll make
var API = {
  submitUser: function(user) {
    // var token = localStorage.getItem("triviaToken");
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "my token goes here"
      },
      statusCode: {
        401: function() {
          alert("That username already exists. Either enter the correct password or choose a new username.");
        }
      },
      type: "POST",
      url: "api/login",
      data: JSON.stringify(user)
    }).then(function(res) {
      console.log(res);
      if (res.authenticated) {
        var p1Display = res.game.players.player1.username.toUpperCase();
        $p1WinningsTag.show();
        $p1Winnings.text(res.game.players.player1.totalScore);
        $p1Name.text(p1Display);
        $loginButton.hide();
        $loginPassword.hide();
        $loginUsername.hide();
        $logoutButton.show();
        $usernameLabel.hide();
        $passwordLabel.hide();
      } else {
        alert("Thanks for joining the game, " + user.username + ". Enter your credentials again to log in.");
      };
    });
  },

  logOut: function() {
    return $.ajax({
      url: "api/logout",
      type: "GET"
    }).then(function(res){
      console.log(res);
      $p1Name.text(res.players.p1Name);
      $p1Winnings.text('0');
      $p1WinningsTag.hide();
      $loginButton.show();
      $loginPassword.show();
      $loginUsername.show();
      $logoutButton.hide();
      $usernameLabel.show();
      $passwordLabel.show();
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
        $p1Winnings.text(res.players.player1.totalScore);
      } else {
        $solveArea.hide();
        $spinChoice.show();
        $solveChoice.show();
        $wheel.show();
      }
      document.getElementById("puzzle-guess-value").value = "";
    });
  }
};

var handleFormSubmit = function(event) {
  event.preventDefault();

  var creds = {
    username: $loginUsername.val().trim(),
    password: $loginPassword.val().trim(),
  };

  if (!(creds.username && creds.password)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.submitUser(creds);

  $loginUsername.val("");
  $loginPassword.val("");
};

// EVENT LISTENERS
$loginButton.on("click", handleFormSubmit);
$spinChoice.on("click", function() {
  API.spinWheel();
});
$solveChoice.on("click", function() {
  $solveArea.show();
  $solveChoice.hide();
  $vowelChoice.hide();
  $spinChoice.hide();
  $wheel.hide();
  $commentary.text(
    "For your puzzle guess, you only need to enter the letters! Symbols and punctuation are not needed."
  );
});
$solveSubmit.on("click", function() {
  API.submitSolve($puzzleGuess.val());
});
$p1StartRound.on("click", function() {
  API.startRound();
  $p1StartRound.hide();
});
$submitGuess.on("click", function() {
  if ($currentGuess.val() === "") {
    $commentary.text("Whoops - make sure to enter a letter!");
    return;
  } else {
    API.submitGuess($currentGuess.val());
  }
});
$vowelChoice.on("click", function() {
  API.guessVowel();
});
$logoutButton.on("click", function() {
  API.logOut();
});

$("#puzzle-guess-value").keydown(function(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
  }
});

$("#current-guess").keydown(function(e) {
  // Only allow delete, backspace, enter:
  if ($.inArray(e.keyCode, [8, 13, 46]) !== -1) {
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

// Allows the Enter key to hit the submit button for guesses.
// $(document).on("keypress", function(e) {
//   if (e.which == 13) {
//     API.submitGuess($currentGuess.val());
//   }
// });
