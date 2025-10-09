CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    passwordSalt VARCHAR(255) NOT NULL ,
    passwordHash VARCHAR(255) NOT NULL ,
    createdAt datetime not null,
    updatedAt datetime not null
);


INSERT INTO `fluidtracker`.`users`
(
`email`,
`passwordSalt`,
`passwordHash`,
`createdAt`,
`updatedAt`)
VALUES
(
'ardliath@gmail.com',
'123',
'123',
'2025-01-01 00:00:00',
'2025-01-01 00:00:00');
