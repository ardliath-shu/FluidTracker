CREATE TABLE users (
     userId INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordSalt VARCHAR(255) NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    );

    INSERT INTO fluidtracker.users (
        email,
        passwordSalt,
        passwordHash,
        createdAt,
        updatedAt
    ) VALUES (
        'ardliath@gmail.com',
        '123',
        '123',
        '2025-01-01 00:00:00',
        '2025-01-01 00:00:00'
    );

    CREATE TABLE fluidtracker.patients (
        patientId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        CONSTRAINT fk_patients_users FOREIGN KEY (userId) REFERENCES users(userId)
    );

    INSERT INTO fluidtracker.patients (
        userId,
        firstName,
        lastName,
        createdAt,
        updatedAt
    ) VALUES (
        1,
        'Adam',
        'Smith',
        '2025-01-01 00:00:00',
        '2025-01-01 00:00:00'
    );

    CREATE TABLE fluidtracker.relationships (
        relationshipId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        patientId INT NOT NULL,
        notes VARCHAR(255) NULL,
        CONSTRAINT fk_relationships_patients FOREIGN KEY (patientId) REFERENCES patients(patientId),
        CONSTRAINT fk_relationships_users FOREIGN KEY (userId) REFERENCES users(userId)
    );

    INSERT INTO fluidtracker.relationships (
        userId,
        patientId,
        notes
    ) VALUES (
        1,
        1,
        'This is a test relationship'
    );

    CREATE TABLE fluidtracker.fluidTargets (
        fluidTargetId INT AUTO_INCREMENT PRIMARY KEY,
        patientId INT NOT NULL,
        userId INT NOT NULL,
        createdAt DATETIME NOT NULL,
        effectiveFrom DATETIME NOT NULL,
        effectiveTo DATETIME NULL,
        isActive BOOLEAN NOT NULL,
        millilitres INT NOT NULL,
        CONSTRAINT fk_fluidTargets_patients FOREIGN KEY (patientId) REFERENCES patients(patientId),
        CONSTRAINT fk_fluidTargets_users FOREIGN KEY (userId) REFERENCES users(userId)
    );

    INSERT INTO fluidtracker.fluidTargets (
        patientId,
        userId,
        createdAt,
        effectiveFrom,
        effectiveTo,
        isActive,
        millilitres
    ) VALUES
    (
        1,
        1,
        '2025-01-01 00:00:00',
        '2025-01-01 00:00:00',
        '2025-03-01 00:00:00',
        FALSE,
        2000
    ),
    (
        1,
        1,
        '2025-03-01 00:00:00',
        '2025-03-01 00:00:00',
        '2025-10-09 23:59:59',
        FALSE,
        2200
    ),
    (
        1,
        1,
        '2025-10-10 00:00:00',
        '2025-10-10 00:00:00',
        NULL,
        TRUE,
        2500
    );




    CREATE TABLE fluidtracker.fluidentries (
        fluidEntryId INT AUTO_INCREMENT PRIMARY KEY,
        patientId INT NOT NULL,
        userId INT NOT NULL,
        createdAt DATETIME NOT NULL,
        millilitres INT NOT NULL,
        date DATE NOT NULL,
        timeStarted INT NOT NULL,
        timeEnded INT NULL,
        note VARCHAR(1023) NULL,
        CONSTRAINT fk_fluidEntries_patients FOREIGN KEY (patientId) REFERENCES patients(patientId),
        CONSTRAINT fk_fluidEntries_users FOREIGN KEY (userId) REFERENCES users(userId)
    );


    INSERT INTO fluidtracker.fluidentries(patientId,
	userId, 
    createdAt,
    millilitres,
    date,
    timeStarted,
    timeEnded,
    note) VALUES(1,
    1,
    '2025-01-13 16:30',
    200,
    '2025-01-13',
    1000,
    1030,
    'Completed drink')
    

    INSERT INTO fluidtracker.fluidentries(patientId,
	userId, 
    createdAt,
    millilitres,
    date,
    timeStarted,
    timeEnded,
    note) VALUES(1,
    1,
    '2025-01-13 16:30',
    200,
    '2025-01-13',
    1060,
    null,
    'In Progress Drink')
    
    