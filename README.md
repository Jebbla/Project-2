# Diceroll of Riches!
Welcome to the game that lets ~~contestants~~ a contestant face ~~each other~~ themselves in a letter-guessing, phrase-deducing battle of **_RICHES_** and **_LUXURY_**!

## What is this game?
What's more fun than playing a game? Playing a game where you keep your score, of course! There's nothing like racking up an arbitrary score of fake money, garnished with pride over being able to solve more puzzles than your friends.

Start with a word or phrase, where all you see is blanks for each of the letters and a category cluing you in as to what the solution is! Roll the dice to determine how much money will be rewarded, then guess a letter to be revealed in the puzzle. If you were right, get the amount of the reward for each of the correct instances of the letter!

Spend money to guess vowels. Finally, take a stab at solving the puzzle if you think you know it, and win everything you've collected for the round! Careful, though - guess a letter or the puzzle wrong, and you lose money!

## How does it work?
This app and controller are run on a Node.js and Express server along with technologies like Handlebars for the front end, web-based view. MySQL & Sequelize act as the model - the data source and repository.

The database contains tables for the solutions, game board, and players.

## How do you actually play it?
This is a web-based application that will hopefully be fairly straightforward as the project develops.

1. Go to the page and set up an account.

2. Join a game.

3. ???

4. Profit!

## Future Developments
* We hope to integrate technologies like Socket.io to enable multiple players to play the game simultaneously.
* Currently, the authentication process is simply a check to a value in the database with no encryption or security. Between packages such as BCrypt and JSONWebToken, we hope to add legitimate authentication.
* Several other minor developments, like graphical improvements, the ability to add user puzzles, and more.

## Enough, already! Where do I go to play?

[Ctrl+click here to open the game in a new browser tab!](https://cohort13project2group6.herokuapp.com/ "Circle of Riches on Heroku")
