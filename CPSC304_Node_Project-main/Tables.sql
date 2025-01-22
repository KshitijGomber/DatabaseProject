DROP TABLE Comments CASCADE CONSTRAINTS;
DROP TABLE Review CASCADE CONSTRAINTS;
DROP TABLE Player_Achievement CASCADE CONSTRAINTS;
DROP TABLE Achievement CASCADE CONSTRAINTS;
DROP TABLE Item CASCADE CONSTRAINTS;
DROP TABLE Game CASCADE CONSTRAINTS;
DROP TABLE Publishing_Company CASCADE CONSTRAINTS;
DROP TABLE Player CASCADE CONSTRAINTS;
DROP TABLE Programmer CASCADE CONSTRAINTS;
DROP TABLE Artist CASCADE CONSTRAINTS;

-- Create Publishing Company Table
CREATE TABLE Publishing_Company (
    company_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    PRIMARY KEY (company_name)
);

grant select on Publishing_Company to public;

-- Create Game Table
CREATE TABLE Game (
    name VARCHAR(100) NOT NULL,
    developing_company VARCHAR(100) NOT NULL,
    release_year INTEGER NOT NULL,
    genre VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    publishing_company VARCHAR(100) NOT NULL,
    PRIMARY KEY (name, developing_company),
    FOREIGN KEY (publishing_company) REFERENCES Publishing_Company(company_name) ON DELETE CASCADE
);

grant select on Game to public;

-- Create Player Table
CREATE TABLE Player (
    username VARCHAR(50) NOT NULL,
    followers INTEGER,
    following INTEGER,
    reviews INTEGER,
    achievements INTEGER,
    PRIMARY KEY (username)
);

grant select on Player to public;

CREATE TABLE Review (
    rating INTEGER NOT NULL,
    game_name VARCHAR2(100) NOT NULL,
    game_developing_company VARCHAR2(100) NOT NULL,
    time TIMESTAMP NOT NULL,
    text CLOB NOT NULL,  
    author_username VARCHAR2(50) NOT NULL,
    PRIMARY KEY (game_name, author_username),
    FOREIGN KEY (author_username) REFERENCES Player(username) ON DELETE CASCADE,
    FOREIGN KEY (game_name, game_developing_company) REFERENCES Game(name, developing_company) ON DELETE CASCADE
);

grant select on Review to public;

-- Create Comment Table
CREATE TABLE Comments (
    time TIMESTAMP NOT NULL,
    author_username VARCHAR2(50) NOT NULL,
    text CLOB,
    game_name VARCHAR2(100) NOT NULL,
    game_developing_company VARCHAR2(100) NOT NULL,
    PRIMARY KEY (
        time,
        author_username,
        game_name,
        game_developing_company
    ),
    FOREIGN KEY (author_username) REFERENCES Player(username) ON DELETE CASCADE,
    FOREIGN KEY (game_name, author_username) REFERENCES Review(game_name, author_username) ON DELETE CASCADE
);

grant select on Comments to public;

-- Create Item Table
CREATE TABLE Item (
    id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    function VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    developing_company VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (game_name, developing_company) REFERENCES Game(name, developing_company) ON DELETE CASCADE
);

grant select on Item to public;

-- Create Achievement Table
CREATE TABLE Achievement (
    name VARCHAR(100) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    developing_company VARCHAR(100) NOT NULL,
    requirements VARCHAR(255),
    PRIMARY KEY (name, game_name),
    FOREIGN KEY (game_name, developing_company) REFERENCES Game(name, developing_company) ON DELETE CASCADE
);

grant select on Achievement to public;

-- Create Player_Achievement Table
CREATE TABLE Player_Achievement (
    player_username VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (player_username, achievement_name, game_name),
    FOREIGN KEY (player_username) REFERENCES Player(username) ON DELETE CASCADE,
    FOREIGN KEY (achievement_name, game_name) REFERENCES Achievement(name, game_name) ON DELETE CASCADE
);

grant select on Player_Achievement to public;

-- Create Programmer Table
CREATE TABLE Programmer (
    company_name VARCHAR(100) NOT NULL,
    employee_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    PRIMARY KEY (company_name, employee_id)
);

grant select on Programmer to public;

-- Create Artist Table
CREATE TABLE Artist (
    company_name VARCHAR(100) NOT NULL,
    employee_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    PRIMARY KEY (company_name, employee_id)
);

grant select on Artist to public;

INSERT INTO Publishing_Company VALUES ('publishingcompany1', 'City1');
INSERT INTO Publishing_Company VALUES ('publishingcompany2', 'City2');
INSERT INTO Publishing_Company VALUES ('publishingcompany3', 'City3');

INSERT INTO Game VALUES ('game1', 'developingcompany1', 2020, 'action', 49.99, 'PC', 'publishingcompany1');
INSERT INTO Game VALUES ('game2', 'developingcompany2', 2021, 'adventure', 59.99, 'Console', 'publishingcompany2');
INSERT INTO Game VALUES ('game3', 'developingcompany3', 2022, 'RPG', 69.99, 'Mobile', 'publishingcompany3');

INSERT INTO Player VALUES ('player1', 100, 50, 10, 5);
INSERT INTO Player VALUES ('player2', 200, 100, 15, 7);
INSERT INTO Player VALUES ('player3', 150, 80, 20, 9);

INSERT INTO Achievement VALUES ('achievement1', 'game1', 'developingcompany1', 'Score 1000 points');
INSERT INTO Achievement VALUES ('achievement2', 'game2', 'developingcompany2', 'Complete 5 missions');
INSERT INTO Achievement VALUES ('achievement3', 'game3', 'developingcompany3', 'Defeat the final boss');

INSERT INTO Item VALUES (1, 9.99, 'Boosts speed', 'speedbooster', 'game1', 'developingcompany1');
INSERT INTO Item VALUES (2, 4.99, 'Increases power', 'powerup', 'game2', 'developingcompany2');
INSERT INTO Item VALUES (3, 14.99, 'Unlocks new level', 'levelunlocker', 'game3', 'developingcompany3');

INSERT INTO Review VALUES (5, 'game1', 'developingcompany1', TO_TIMESTAMP('2024-11-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Amazing game!', 'player1');
INSERT INTO Review VALUES (5, 'game1', 'developingcompany1', TO_TIMESTAMP('2024-11-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Amazing game!', 'player2');
INSERT INTO Review VALUES (5, 'game1', 'developingcompany1', TO_TIMESTAMP('2024-11-01 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Amazing game!', 'player3');

INSERT INTO Review VALUES (4, 'game2', 'developingcompany2', TO_TIMESTAMP('2024-11-02 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Very engaging.', 'player2');
INSERT INTO Review VALUES (3, 'game3', 'developingcompany3', TO_TIMESTAMP('2024-11-03 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Could be better.', 'player3');
INSERT INTO Review VALUES (3, 'game3', 'developingcompany3', TO_TIMESTAMP('2024-11-03 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Could be better.', 'player2');
INSERT INTO Review VALUES (3, 'game3', 'developingcompany3', TO_TIMESTAMP('2024-11-03 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Could be better.', 'player1');

INSERT INTO Comments VALUES (
    TO_TIMESTAMP('2024-11-04 12:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'player1',
    'I agree with the review.',
    'game1',
    'developingcompany1'
);
INSERT INTO Comments VALUES (
    TO_TIMESTAMP('2024-11-07 10:00:00', 'YYYY-MM-DD HH24:MI:SS'),
    'player2',
    'This is my comment.',
    'game2',
    'developingcompany4'
);

INSERT INTO Player_Achievement VALUES ('player1', 'achievement1', 'game1');
INSERT INTO Player_Achievement VALUES ('player2', 'achievement2', 'game2');
INSERT INTO Player_Achievement VALUES ('player3', 'achievement3', 'game3');

INSERT INTO Programmer VALUES ('developingcompany1', 101, 'programmer1', 'AI Specialist');
INSERT INTO Programmer VALUES ('developingcompany2', 102, 'programmer2', 'Graphics Specialist');
INSERT INTO Programmer VALUES ('developingcompany3', 103, 'programmer3', 'Gameplay Specialist');

INSERT INTO Artist VALUES ('developingcompany1', 201, 'artist1', 'Concept Art');
INSERT INTO Artist VALUES ('developingcompany2', 202, 'artist2', '3D Modeling');
INSERT INTO Artist VALUES ('developingcompany3', 203, 'artist3', 'Animation');
