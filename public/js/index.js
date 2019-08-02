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
var $p1Score = $("#p1-score");
var $p2Score = $("#p2-score");
var $p3Score = $("#p3-score");
var $wheel = $("#wheel");
var vowelGuess = false;

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    var token = localStorage.getItem("triviaToken");
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + "my token goes here"
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
        .text(example.text)
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

  var user = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function(data) {
    localStorage.setItem("triviaToken", data.token);
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
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

$("puzzle-guess-value").keydown(function(e) {
  // Enter was pressed without shift key
  if (e.keyCode === 13 && !e.shiftKey) {
    // prevent default behavior
    e.preventDefault();
  }
});

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

// Allows the Enter key to hit the submit button for guesses.
// $(document).on("keypress", function(e) {
//   if (e.which == 13) {
//     API.submitGuess($currentGuess.val());
//   }
// });
