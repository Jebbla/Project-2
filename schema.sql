DROP DATABASE IF EXISTS wofpuzzles_db;
CREATE DATABASE wofpuzzles_db;
USE wofpuzzles_db;

CREATE TABLE puzzles(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  puzzleTopic VARCHAR(100),
  puzzleAnswer VARCHAR(500),
  PRIMARY KEY (id)
);


INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Around the House', 'Plastic Storage Containers');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Around the House', 'Reclining Lounge Chair');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Around the House', 'Reusable Shopping Bag');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Around the House', 'Spare Keys');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Around the House', 'Blackberry Scented Hand Soap');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Artist/Song', 'The Osmonds - Crazy Horses');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Artist/Song', 'KISS - I Was Made For Loving You');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Artist/Song', 'Starship - We Built This City');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Artist/Song', 'Was Not Was - Walk the Dinosaur');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Artist/Song', 'Escape Club - Wild Wild West ');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Event', 'Preliminary Investigation');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Event', 'Sailing Across the Atlantic Ocean');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Event', 'Space Shuttle Launch');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Event', 'Black-tie Affair');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Event', 'Guided Personal Tour');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Fictional Characters', 'Indiana Jones');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Fictional Characters', 'Loch Ness Monster');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Fictional Characters', 'Puff the Magic Dragon');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Fictional Characters', 'Stay-Puft Marshmallow Man');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Fictional Characters', 'Captain Kathryn Janeway');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Food & Drink', 'Aged Parmesan Cheese');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Food & Drink', 'Marshmallow Krispy Treat');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Food & Drink', 'Jimmy Johns Sandwich');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Food & Drink', 'Artichoke Hearts');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Food & Drink', 'Spicy Chai Tea Latte');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Living Things', 'Monarch Butterfly');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Living Things', 'A Mother Bear and her Cubs');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Living Things', 'Two-Toed Sloth');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Living Things', 'German Short-Haired Pointer');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Living Things', 'Bioluminescent Octopi');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Movie Title', 'The Watcher in the Woods');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Movie Title', 'Avengers Endgame');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Movie Title', 'Anna and the King');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Movie Title', 'Back to the Future');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Movie Title', 'Grumpy Old Men');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Occupations', 'Full-Stack Web Developer');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Occupations', 'Emergency Room Nurse');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Occupations', 'Customer Service Representative');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Occupations', 'Foreign Correspondent');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Occupations', 'Radio Producer');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('On the Map', 'University of Minnesota');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('On the Map', 'Fort Morgan, Colorado');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('On the Map', 'Las Vegas, Nevada');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('On the Map', 'Barcelona, Spain');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('On the Map', 'Minneapolis, Minnesota');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('People', 'Full-Stack Web Development Students');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('People', 'Patron of the Arts');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('People', 'Outstanding Citizen');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('People', 'Synchronized Swimmers');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('People', 'PeeWee Baseball Team');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Phrase', 'Birds of a Feather Flock Together');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Phrase', 'Refrigerate After Opening');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Phrase', 'May I Have Your Attention Please?');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Phrase', 'Works like a Charm');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Phrase', 'More Fun than a Barrel of Monkeys');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Places', 'Medical Office Waiting Room');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Places', 'Mad Science Laboratory');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Places', 'Undergound Parking Garage');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Places', 'Youth Hostel');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Places', 'Downtown Condo');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Proper Name', 'Adam Grise');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Proper Name', 'Jessica LaPage');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Proper Name', 'Raxem Mohamed');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Proper Name', 'Mohamed Abdi');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Quotations', 'One Mans Trash is Another mans Treasure');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Quotations', 'Magic Mirror on the Wall');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Quotations', 'You Can Do it, Put Your Back into it');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Quotations', 'One Giant Leap for Mankind');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Rhyme Time', 'Creature Feature');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Rhyme Time', 'Fender Bender');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Rhyme Time', 'Beat the Heat');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Rhyme Time', 'Yertle the Turtle');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Rhyme Time', 'Cheat Sheet');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Same Name', 'Haralson And Fiona Apple');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Same Name', 'Kevin and Crispy Bacon');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Same Name', 'Internet and Train Connection');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Same Name', 'Umbrella and Lemonade Stand');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Same Name', 'Feetwood and Big Mac');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Song Lyrics', 'Look For the Purple Banana Til They Put Us In the Truck, Lets Go');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Song Lyrics', 'You Are the Wind Beneath My Wings');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Song Lyrics', 'If I Go Ther Will Be Trouble, If I Stay Ther Will Be Double');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Song Lyrics', 'New Kids on the Block had a Bunch of Hits, Chinese Food Makes Me Sick');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Song Lyrics', 'Im Gonna Get a Hot Dog After this Club');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Thing', 'Cinnamon Flavored Mouthwash');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Thing', 'Dry Desert Climate');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Thing', 'Great First Impression');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Thing', 'Handlebar Moustache');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Thing', 'Netflix and Chill');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Title', 'Guinness Book of World Records');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Title', 'The Yellow Wallpaper');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Title', 'Minneapolis Star Tribune');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Title', 'Watership Down');
INSERT INTO puzzles (puzzleTopic, puzzleAnswer) values ('Title', 'New York Times');















