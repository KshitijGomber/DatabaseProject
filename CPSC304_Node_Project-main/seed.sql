-- Insert data into Player table
INSERT INTO Player (username, followers, following, reviews, achievements) 
VALUES 
    ('player1', 120, 100, 10, 5),
    ('player2', 50, 75, 7, 3),
    ('player3', 80, 60, 5, 2),
    ('player4', 200, 190, 15, 8),
    ('player5', 300, 280, 25, 10);


INSERT INTO Game (name, developing_company, release_year, genre, price, platform, publishing_company) 
VALUES 
    ('CyberAction', 'DevCompany1', 2021, 'Action', 59.99, 'PC', 'PubCompany1'),
    ('AdventureQuest', 'DevCompany2', 2019, 'Adventure', 49.99, 'Xbox', 'PubCompany2'),
    ('MysterySolve', 'DevCompany3', 2020, 'Puzzle', 39.99, 'PlayStation', 'PubCompany3');


INSERT INTO Review (rating, game_name, game_developing_company, time, text, author_username)
VALUES 
    (5, 'CyberAction', 'DevCompany1', CURRENT_TIME, 'Amazing gameplay!', 'player1'),
    (4, 'AdventureQuest', 'DevCompany2', CURRENT_TIME, 'Very engaging!', 'player3'),
    (3, 'MysterySolve', 'DevCompany3', CURRENT_TIME, 'Decent puzzle-solving experience.', 'player4');


INSERT INTO Item (id, price, function, name, game_name, developing_company)
VALUES 
    (101, 15.99, 'Boost', 'Shield', 'CyberAction', 'DevCompany1'),
    (102, 25.99, 'Heal', 'Potion', 'AdventureQuest', 'DevCompany2'),
    (103, 35.99, 'Upgrade', 'Skill Crystal', 'MysterySolve', 'DevCompany3');

