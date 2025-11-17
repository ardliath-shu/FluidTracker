-- Check if the fluidtracker database exists, and create it if it doesn't
CREATE DATABASE IF NOT EXISTS fluidtracker;

-- Use the fluidtracker database
USE fluidtracker;

-- Create the 'user' table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each user
    email VARCHAR(255) NOT NULL UNIQUE, -- User's email address
    -- Remove the password hashing and salting as they are handled by Better Auth internally.
    name VARCHAR(255), -- User's display name
    emailVerified BOOLEAN DEFAULT FALSE, -- Whether the user's email is verified
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Timestamp of account creation
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp of last update
);

-- Insert test user
INSERT INTO user (email, name, emailVerified, createdAt, updatedAt)
VALUES
    ('ardliath@gmail.com', 'Ardliath', TRUE, '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    ('john.doe@example.com', 'John Doe', FALSE, '2025-02-01 00:00:00', '2025-02-01 00:00:00');


-- Create the 'patients' table
CREATE TABLE patients (
    patientId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_patients_users FOREIGN KEY (userId) REFERENCES user(id)
);

-- Insert a test patient
INSERT INTO patients (userId, firstName, lastName, createdAt, updatedAt)
VALUES
    (1, 'Adam', 'Smith', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    (2, 'Jane', 'Doe', '2025-02-01 00:00:00', '2025-02-01 00:00:00');


-- Create the 'relationships' table
CREATE TABLE relationships (
    relationshipId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    patientId INT NOT NULL,
    notes VARCHAR(255) NULL,
    -- Prevent duplicate carer->patient links
    UNIQUE KEY uq_relationship_user_patient (userId, patientId),
    CONSTRAINT fk_relationships_patients FOREIGN KEY (patientId) REFERENCES patients(patientId),
    CONSTRAINT fk_relationships_users FOREIGN KEY (userId) REFERENCES user(id)
);

-- Insert a test relationship
INSERT INTO relationships (userId, patientId, notes)
VALUES
    (1, 1, 'Primary caregiver'),
    (2, 2, 'Secondary caregiver');


-- Create the 'session' table
CREATE TABLE session (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each session
    userId INT NOT NULL, -- The ID of the user
    token VARCHAR(255) NOT NULL UNIQUE, -- The unique session token
    expiresAt DATETIME NOT NULL, -- The time when the session expires
    ipAddress VARCHAR(45), -- The IP address of the device (optional)
    userAgent VARCHAR(512), -- The user agent information of the device (optional)
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);
-- Insert test sessions
INSERT INTO session (id, userId, token, expiresAt, ipAddress, userAgent, createdAt, updatedAt)
VALUES
    (1, 1, 'token1', '2025-12-31 23:59:59', '192.168.1.1', 'Mozilla/5.0', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    (2, 2, 'token2', '2025-12-31 23:59:59', '192.168.1.2', 'Mozilla/5.0', '2025-02-01 00:00:00', '2025-02-01 00:00:00');


-- Create the `verification` table
CREATE TABLE verification (
    id VARCHAR(36) PRIMARY KEY, -- Unique identifier for each verification
    identifier VARCHAR(255) NOT NULL, -- The identifier for the verification request
    value VARCHAR(255) NOT NULL, -- The value to be verified
    expiresAt DATETIME NOT NULL, -- The time when the verification request expires
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert test verifications
INSERT INTO verification (id, identifier, value, expiresAt, createdAt, updatedAt)
VALUES
    ('verification1', 'email', 'ardliath@gmail.com', '2025-12-31 23:59:59', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
    ('verification2', 'email', 'john.doe@example.com', '2025-12-31 23:59:59', '2025-02-01 00:00:00', '2025-02-01 00:00:00');


-- Create the 'account' table
CREATE TABLE account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    providerId VARCHAR(191) NOT NULL,
    accountId VARCHAR(191) NOT NULL,
    password VARCHAR(255) NULL,
    accessToken VARCHAR(512) NULL,
    refreshToken VARCHAR(512) NULL,
    scope VARCHAR(512) NULL,
    idToken VARCHAR(1024) NULL,
    expiresAt DATETIME NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY account_provider_unique (providerId, accountId),
    CONSTRAINT fk_account_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);


-- Create the 'fluidTargets' table
CREATE TABLE fluidTargets (
    fluidTargetId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    effectiveFrom DATETIME NOT NULL,
    effectiveTo DATETIME NULL,
    isActive BOOLEAN NOT NULL,
    millilitres INT NOT NULL,
    CONSTRAINT fk_fluidTargets_patients FOREIGN KEY (patientId) REFERENCES patients(patientId),
    CONSTRAINT fk_fluidTargets_users FOREIGN KEY (userId) REFERENCES user(id)
);

-- Insert test fluid targets
INSERT INTO fluidTargets (patientId, userId, createdAt, effectiveFrom, effectiveTo, isActive, millilitres)
VALUES
    (1, 1, '2025-01-01 00:00:00', '2025-01-01 00:00:00', '2025-03-01 00:00:00', FALSE, 2000),
    (1, 1, '2025-03-01 00:00:00', '2025-03-01 00:00:00', NULL, TRUE, 2500),
    (2, 2, '2025-02-01 00:00:00', '2025-02-01 00:00:00', NULL, TRUE, 1800);


-- Create the 'fluidentries' table
CREATE TABLE fluidentries (
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
    CONSTRAINT fk_fluidEntries_users FOREIGN KEY (userId) REFERENCES user(id)
);

-- Insert test fluid entries
INSERT INTO fluidentries(patientId, userId, createdAt, millilitres, date, timeStarted, timeEnded, note) 
VALUES
    (1, 1, '2025-01-13 16:30', 200, '2025-01-13', 1000, 1030, 'Completed drink'),
    (1, 1, '2025-01-13 16:30', 200, '2025-01-13', 1060, null, 'In Progress Drink');


-- Carer invite codes for linking carers to patients
CREATE TABLE IF NOT EXISTS carerInvites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) NOT NULL UNIQUE,
    patientId INT NOT NULL,
    expiresAt DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(patientId) ON DELETE CASCADE
);
