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
var $p1StartRound = $("#p1start-round");
var $p2StartRound = $("#p2start-round");
var $p3StartRound = $("#p3start-round");
var $roundCategory = $("#round-category");
var $p1Score = $("#p1-score"); 
var $p2Score = $("#p2-score"); 
var $p3Score = $("#p3-score"); 


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
      $p1Score.text(0);
      $p2Score.text(0);
      $p3Score.text(0);
    });
  },
  submitGuess: function (guess) {
    console.log(guess);
    guess = guess.toUpperCase();
    console.log(guess);
    return $.ajax({
      url: "api/processGuess",
      data: {
        guess: guess
      },
      type: "GET"
    }).then(function(res){
      //something with response
      eraseText();
      console.log(res);
      $roundCategory.text(res.category);
      $theWord.text(res.blanksArr.join(""));
      $roundGuesses.text(res.guessLog.join(" "));
      $(".commentary").text(res.resText);
      $p1Score.text(res.players.p1Score);
      $p2Score.text(res.players.p2Score);
      $p3Score.text(res.players.p3Score);
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

// Add event listeners to the submit and delete buttons
$loginButton.on("click", handleFormSubmit);
$solveChoice.on("click", function(){
  $("#solve-area").show();
});
$p1StartRound.on("click", function(){
  API.startRound()
  $p1StartRound.hide()
});
$submitGuess.on("click", function(){
  API.submitGuess($currentGuess.val())
  $("#current-guess").value = "";
});

/*******************************************Adam's jQuery code */
/*******************************************Adam's jQuery code */

var category = '';

//// FUNCTIONS FOR PREPPING THE ROUND
var freshRound = function () {
    guessesLog.length = 0;
};


var eraseText = function () {
    $("#current-guess").value = "";
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


// Page loads & runs game
// gameSetup();

$(document).on('keypress', function (e) {
    if (e.which == 13) {
        API.submitGuess($currentGuess.val());
    }
});