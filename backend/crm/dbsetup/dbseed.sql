-- Ensure database creation if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crmdatabase') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE crmdatabase');
    END IF;
END $$;

-- Create profiles table
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
    id                  SERIAL PRIMARY KEY,
    first_name          VARCHAR(50)  NOT NULL,
    last_name           VARCHAR(50)  NOT NULL,
    email               VARCHAR(100) NOT NULL UNIQUE,
    phone               VARCHAR(15)  NOT NULL,
    address             VARCHAR(100) NOT NULL,
    city                VARCHAR(50)  NOT NULL,
    state               VARCHAR(50)  NOT NULL,
    zip                 VARCHAR(10)  NOT NULL,
    country             VARCHAR(50)  NOT NULL,
    date_of_birth       DATE         NOT NULL,
    gender              VARCHAR(20)  NOT NULL,  -- Expanded to allow enum string values
    is_email_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
    verification_token  VARCHAR(64),
    verification_status VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
);
CREATE SEQUENCE profiles_seq START 4;
ALTER SEQUENCE profiles_seq INCREMENT BY 50;



-- Insert sample data into profiles
INSERT INTO profiles (id, first_name, last_name, email, phone, address, city, state, zip, country, date_of_birth, gender, is_email_verified, verification_token, verification_status)
VALUES
    (1, 'John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Anytown', 'Anystate', '12345', 'USA', '1980-01-01', 'MALE', FALSE, 'token123', 'PENDING'),
    (2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', '456 Elm St', 'Othertown', 'Otherstate', '67890', 'USA', '1990-02-02', 'FEMALE', TRUE, 'token456', 'VERIFIED'),
    (3, 'Alice', 'Johnson', 'alice.johnson@example.com', '5555555555', '789 Oak St', 'Sometown', 'Somestate', '11223', 'USA', '2000-03-03', 'FEMALE', FALSE, 'token789', 'PENDING'),
    (4, 'Robert', 'Brown', 'robert.brown@example.com', '1112223333', '101 Pine St', 'Newtown', 'Newstate', '44556', 'USA', '1975-04-15', 'MALE', TRUE, NULL, 'VERIFIED'),
    (5, 'Emma', 'Wilson', 'emma.wilson@example.com', '2223334444', '202 Cedar St', 'Oldtown', 'Oldstate', '77889', 'USA', '1985-05-20', 'FEMALE', FALSE, 'token789', 'PENDING'),
    (6, 'David', 'Taylor', 'david.taylor@example.com', '3334445555', '303 Maple St', 'Middletown', 'Middlestate', '99100', 'USA', '1992-06-25', 'MALE', TRUE, NULL, 'VERIFIED');

-- Create client_accounts table
DROP TABLE IF EXISTS client_accounts;
CREATE TABLE client_accounts (
    account_id     SERIAL PRIMARY KEY,
    profile_id     BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    account_type   VARCHAR(50) NOT NULL,
    account_status VARCHAR(50) NOT NULL,
    opening_date   DATE DEFAULT CURRENT_DATE,
    currency       VARCHAR(3)  NOT NULL,
    branch_id      VARCHAR(10) NOT NULL,
    initial_deposit DOUBLE PRECISION NOT NULL CHECK (initial_deposit >= 0)
);

-- Insert sample data into client_accounts
INSERT INTO client_accounts (account_id, profile_id, account_type, account_status, opening_date, currency, branch_id, initial_deposit)
VALUES
    -- Accounts for John Doe
    (1, 1, 'SAVINGS', 'ACTIVE', '2023-01-01', 'USD', 'BR001', 1000.00),
    (2, 1, 'CHECKING', 'INACTIVE', '2022-01-01', 'USD', 'BR001', 500.00),

    -- Accounts for Jane Smith
    (3, 2, 'BUSINESS', 'PENDING', '2023-02-01', 'USD', 'BR002', 1500.00),

    -- Accounts for Alice Johnson
    (4, 3, 'SAVINGS', 'ACTIVE', '2021-05-15', 'EUR', 'BR003', 2000.00),

    -- Accounts for Robert Brown (all active)
    (5, 4, 'CHECKING', 'ACTIVE', '2020-09-30', 'USD', 'BR004', 250.00),
    (6, 4, 'SAVINGS', 'ACTIVE', '2021-09-30', 'USD', 'BR004', 3000.00),

    -- Accounts for Emma Wilson (inactive and pending)
    (7, 5, 'SAVINGS', 'INACTIVE', '2019-07-01', 'USD', 'BR005', 1200.00),
    (8, 5, 'BUSINESS', 'PENDING', '2023-03-01', 'USD', 'BR005', 800.00),

    -- Accounts for David Taylor
    (9, 6, 'SAVINGS', 'ACTIVE', '2022-11-10', 'USD', 'BR006', 500.00),
    (10, 6, 'CHECKING', 'INACTIVE', '2021-11-10', 'USD', 'BR006', 750.00);

-- Create the agent_profile table to establish a one-to-many relationship between agents and profiles
DROP TABLE IF EXISTS agent_profile;
CREATE TABLE agent_profile
(
    id         SERIAL PRIMARY KEY,
    agent_id   VARCHAR(36) NOT NULL,
    client_id  BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE
);

