-- Drop existing tables if they exist
DROP TABLE IF EXISTS agent_profile;
DROP TABLE IF EXISTS client_accounts;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(64),
    verification_status VARCHAR(20) NOT NULL,
    CHECK (gender IN ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY'))
);

-- Create client_accounts table
CREATE TABLE client_accounts (
    account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    profile_id BIGINT NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    account_status VARCHAR(20) NOT NULL,
    opening_date DATE NOT NULL DEFAULT CURRENT_DATE,
    currency VARCHAR(3) NOT NULL,
    branch_id VARCHAR(10) NOT NULL,
    initial_deposit DECIMAL(15, 2) NOT NULL CHECK (initial_deposit >= 0),
    FOREIGN KEY (profile_id) REFERENCES profiles(id),
    CHECK (account_type IN ('SAVINGS', 'CHECKING', 'BUSINESS')),
    CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'PENDING'))
);

-- Create agent_profile table
CREATE TABLE agent_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL,
    client_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (client_id) REFERENCES profiles(id)
);

-- Insert sample data into profiles table
INSERT INTO profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    zip,
    date_of_birth,
    gender,
    is_email_verified,
    verification_token,
    verification_status
) VALUES
-- Profile 1
(1, 'John', 'Doe', 'john.doe@example.com', '+12345678901', '123 Main St', 'Anytown', 'Anystate', 'USA', '12345', '1980-01-01', 'MALE', TRUE, NULL, 'VERIFIED'),
-- Profile 2
(2, 'Jane', 'Smith', 'jane.smith@example.com', '+10987654321', '456 Elm St', 'Othertown', 'Otherstate', 'USA', '54321', '1990-02-02', 'FEMALE', FALSE, 'abc123verificationtoken', 'PENDING'),
-- Profile 3
(3, 'Alice', 'Johnson', 'alice.johnson@example.com', '+19876543210', '789 Oak St', 'Sometown', 'Somestate', 'USA', '67890', '1985-03-03', 'FEMALE', TRUE, NULL, 'VERIFIED'),
-- Profile 4
(4, 'Bob', 'Brown', 'bob.brown@example.com', '+12125551234', '101 Pine St', 'Anycity', 'Anystate', 'USA', '11223', '1975-04-04', 'MALE', TRUE, NULL, 'VERIFIED'),
-- Profile 5
(5, 'Carol', 'Davis', 'carol.davis@example.com', '+14155552678', '202 Maple St', 'Oldtown', 'Oldstate', 'USA', '33445', '1995-05-05', 'FEMALE', FALSE, 'def456verificationtoken', 'PENDING'),
-- Profile 6
(6, 'Eve', 'Miller', 'eve.miller@example.com', '+15105559876', '303 Birch St', 'Newtown', 'Newstate', 'USA', '55667', '1988-06-06', 'FEMALE', TRUE, NULL, 'VERIFIED'),
-- Profile 7
(7, 'Frank', 'Wilson', 'frank.wilson@example.com', '+16105551234', '404 Cedar St', 'Bigcity', 'Bigstate', 'USA', '77889', '1970-07-07', 'MALE', TRUE, NULL, 'VERIFIED'),
-- Profile 8
(8, 'Grace', 'Lee', 'grace.lee@example.com', '+17105551234', '505 Walnut St', 'Smalltown', 'Smallstate', 'USA', '99000', '1992-08-08', 'FEMALE', FALSE, 'ghi789verificationtoken', 'PENDING'),
-- Profile 9
(9, 'Henry', 'Taylor', 'henry.taylor@example.com', '+18105551234', '606 Chestnut St', 'Middletown', 'Middlestate', 'USA', '11122', '1982-09-09', 'MALE', TRUE, NULL, 'VERIFIED'),
-- Profile 10
(10, 'Isabel', 'Anderson', 'isabel.anderson@example.com', '+19105551234', '707 Spruce St', 'Largetown', 'Largestate', 'USA', '33344', '1998-10-10', 'FEMALE', TRUE, NULL, 'VERIFIED');

-- Insert sample data into client_accounts table
INSERT INTO client_accounts (
    account_id,
    profile_id,
    account_type,
    account_status,
    opening_date,
    currency,
    branch_id,
    initial_deposit
) VALUES
-- Accounts for John Doe (Profile ID 1)
(1, 1, 'SAVINGS', 'ACTIVE', '2020-01-15', 'USD', 'BR001', 1500.00),
(2, 1, 'CHECKING', 'ACTIVE', '2021-06-20', 'USD', 'BR001', 2000.00),
-- Accounts for Jane Smith (Profile ID 2)
(3, 2, 'BUSINESS', 'PENDING', '2022-03-10', 'USD', 'BR002', 5000.00),
-- Accounts for Alice Johnson (Profile ID 3)
(4, 3, 'SAVINGS', 'ACTIVE', '2019-05-05', 'USD', 'BR003', 2500.00),
(5, 3, 'CHECKING', 'ACTIVE', '2020-08-08', 'USD', 'BR003', 1800.00),
-- Account for Bob Brown (Profile ID 4)
(6, 4, 'SAVINGS', 'ACTIVE', '2018-09-09', 'USD', 'BR004', 3000.00),
-- Account for Carol Davis (Profile ID 5)
(7, 5, 'BUSINESS', 'PENDING', '2021-11-11', 'USD', 'BR005', 7000.00),
-- Accounts for Eve Miller (Profile ID 6)
(8, 6, 'CHECKING', 'ACTIVE', '2017-12-12', 'USD', 'BR006', 1200.00),
(9, 6, 'SAVINGS', 'ACTIVE', '2018-01-01', 'USD', 'BR006', 2200.00),
-- Account for Frank Wilson (Profile ID 7)
(10, 7, 'BUSINESS', 'ACTIVE', '2016-02-02', 'USD', 'BR007', 8000.00),
-- Account for Grace Lee (Profile ID 8)
(11, 8, 'SAVINGS', 'PENDING', '2022-03-03', 'USD', 'BR008', 4000.00),
-- Account for Henry Taylor (Profile ID 9)
(12, 9, 'CHECKING', 'ACTIVE', '2015-04-04', 'USD', 'BR009', 1600.00),
-- Account for Isabel Anderson (Profile ID 10)
(13, 10, 'SAVINGS', 'ACTIVE', '2019-05-05', 'USD', 'BR010', 2700.00);

-- Insert sample data into agent_profile table
INSERT INTO agent_profile (
    id,
    agent_id,
    client_id
) VALUES
-- Agents assigned to clients
(1, 'AGENT001', 1),
(2, 'AGENT002', 3),
(3, 'AGENT003', 4),
(4, 'AGENT004', 6),
(5, 'AGENT005', 7),
(6, 'AGENT006', 9),
(7, 'AGENT007', 10);
