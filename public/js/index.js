// Get references to page elements
var $loginUsername = $("#login-username");
var $loginPassword = $("#login-password");
var $loginButton = $("#login-button");
var $exampleList = $("#example-list");
var $theWord = $("#the-word");
var $currentGuess = $("#current-guess");
var $submitGuess = $("#submit-guess");
var $roundGuesses = $("#round-guesses");
var $puzzleGuess = $("#puzzle-guess-value");
var $solveChoice = $("#solve-choice");
var $solveSubmit = $("#solve-submit");
var $vowelChoice = $("#vowel-choice");
var $startRound = $("#start-round");
var $roundCategory = $("#round-category");



// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    var token = localStorage.getItem("triviaToken");
    return $.ajax({
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + "my token goes here" 
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
    }).then(function(res){
      console.log(res);
      $roundCategory.text(res.category);
      $theWord.text(res.blanksArr.join(""));
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

  var example = {
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

// Add event listeners to the submit and delete buttons
$loginButton.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
$startRound.on("click", function(){
  API.startRound()
  $startRound.hide()
});

/*******************************************Adam's jQuery code */
/*******************************************Adam's jQuery code */

// var possibleSolutions = ["plastic storage containers"];
var goodComments = ['Yes, there are X of that letter! $xxx is added to your score.'];
var badComments = ['Sorry, none of that letter. You lose $xxx.']
// var roundSolution = [];
// var roundSolutionBlanks = [];
var guessCorrect = null;
var guessLetter = null;
var win = 0;
var guessesLog = [];
var guessDupe = 0
var category = '';

//// FUNCTIONS FOR PREPPING THE ROUND
var freshRound = function () {
    // roundSolution = [];
    // roundSolutionBlanks = [];
    guessLetter = null;
    guessCorrect = null;
    guessesLog.length = 0;
    // $(".commentary").text("Enter a letter into the box on the left, then click on the 'Submit Guess' button to get started!");
}

var getSolution = function () {
    // word = possibleSolutions[Math.floor(Math.random() * possibleSolutions.length)]
    // word = word.toUpperCase();
    // roundSolution = word.split("");
    // console.log("Round solution chosen: " + roundSolution + " (" + roundSolution.length + " letters)")
};

var genBlanks = function () {
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
}

//// FUNCTIONS FOR EACH USER GUESS

var guessDupeNLog = function () {
    console.log("Guessed letter: " + guessLetter);
    if (guessesLog.includes(guessLetter)) {
        $(".commentary").text("Hold up there, chief. You already guessed that letter!");
        guessDupe = 1;
        eraseText();
    } else {
        guessesLog.push(guessLetter);
        guessDupe = 0;
        $roundGuesses.text(guessesLog.join(" "));
    }
    console.log("Guess Log: " + guessesLog);
}

var guessMatch = function () {
    if (roundSolution.includes(guessLetter)) {
        guessCorrect = 1;
    } else {
        guessCorrect = 0;
        var badCommentPick = Math.floor(Math.random() * badComments.length);
        $(".commentary").text(badComments[badCommentPick]);
    }
}

var guessRevealOrLose = function () {
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
}

var eraseText = function () {
    $currentGuess.value = "";
}

//// WIN CHECK

var guessIsWin = function () {
    if (roundSolutionBlanks.includes("_")) {
        // No action; not a win yet.
    } else {
        youWin();
    }
}

//// USER WINS

var youWin = function () {
    win = 0;
    // Replace this alert, don't restart round until a restart button is pushed
    $submitGuess.prop("disabled", true);
    $(".commentary").text("Yeah! You win! Hit the 'Start a New Game' button to play again.");
    // Disable the submit button until new round starts
}

//////////// Actual stuff -happening- /////////////////

// New Game Setup

var gameSetup = function () {
    freshRound();
    // getSolution();
    // genBlanks();
    // turnsLeft = 6; // Sorry, not drawing a head, body, two arms, two legs :(
    $submitGuess.prop("disabled", false);
    $theWord.text(roundSolutionBlanks.join(""));
    $roundGuesses.text(guessesLog.join(" "));
}

// Control for the text field - only allow letters (no symbols or numbers)
$("#current-guess").onkeyup = function (event) {
    this.value = this.value.replace(/[^a-zA-Z]/gi, '');
}

// Functions for each guess submitted - main cycle
var runGame = function () {
    guessLetter = $currentGuess.val();
    guessLetter = guessLetter.toUpperCase();
    guessDupeNLog();
    if (guessDupe === 0) {
        guessMatch();
        guessRevealOrLose();
        eraseText();
        guessIsWin();
    }
}

// Page loads & runs game
// gameSetup();

$(document).on('keypress', function (e) {
    if (e.which == 13) {
        runGame();
    }
});