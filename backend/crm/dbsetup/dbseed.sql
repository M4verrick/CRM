    -- Check if the database exists before creating it
    DO $$
    BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crmdatabase') THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE crmdatabase');
    END IF;
    END $$;

    -- Create the client_accounts table
    DROP TABLE IF EXISTS client_accounts;
    CREATE TABLE client_accounts
    (
        account_id     SERIAL PRIMARY KEY,
        client_id      BIGINT      NOT NULL,
        account_type   VARCHAR(50) NOT NULL,
        account_status VARCHAR(50) NOT NULL,
        opening_date   DATE,
        currency       VARCHAR(3)  NOT NULL,
        branch_id      VARCHAR(10) NOT NULL,
        initial_deposit DOUBLE PRECISION NOT NULL
    );

    -- Insert some initial data
    INSERT INTO client_accounts (client_id, account_type, account_status, opening_date, currency, branch_id, initial_deposit)
    VALUES
        (1, 'SAVINGS', 'ACTIVE', '2023-01-01', 'USD', 'BR001', 1000.00),
        (2, 'CHECKING', 'PENDING', '2023-02-01', 'USD', 'BR002', 500.00),
        (3, 'BUSINESS', 'INACTIVE', '2023-03-01', 'EUR', 'BR003', 2000.00);

    -- Create the profiles table
    DROP TABLE IF EXISTS profiles;
    CREATE TABLE profiles
    (
        id                  SERIAL PRIMARY KEY,
        first_name          VARCHAR(50)  NOT NULL,
        last_name           VARCHAR(50)  NOT NULL,
        email               VARCHAR(100) NOT NULL UNIQUE,
        phone               VARCHAR(15),
        address             VARCHAR(100),
        city                VARCHAR(50),
        state               VARCHAR(50),
        zip                 VARCHAR(10),
        country             VARCHAR(50),
        date_of_birth       DATE,
        gender              VARCHAR(10),
        is_email_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
        verification_token  VARCHAR(64),
        verification_status VARCHAR(20)  NOT NULL DEFAULT 'PENDING'
    );
    CREATE SEQUENCE profiles_seq START 4;
    ALTER SEQUENCE profiles_seq INCREMENT BY 50;



    -- Insert some initial data
    INSERT INTO profiles (first_name, last_name, email, phone, address, city, state, zip, country, date_of_birth, gender, is_email_verified, verification_token, verification_status)
    VALUES
        ('John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Anytown', 'Anystate', '12345', 'USA', '1980-01-01', 'Male', FALSE, 'token123', 'PENDING'),
        ('Jane', 'Smith', 'jane.smith@example.com', '0987654321', '456 Elm St', 'Othertown', 'Otherstate', '67890', 'USA', '1990-02-02', 'Female', TRUE, 'token456', 'VERIFIED'),
        ('Alice', 'Johnson', 'alice.johnson@example.com', '5555555555', '789 Oak St', 'Sometown', 'Somestate', '11223', 'USA', '2000-03-03', 'Female', FALSE, 'token789', 'PENDING');

    -- Create the agent_profile table to establish a one-to-many relationship between agents and profiles
    DROP TABLE IF EXISTS agent_profile;
    CREATE TABLE agent_profile
    (
        id         SERIAL PRIMARY KEY,
        agent_id   VARCHAR(36) NOT NULL,
        client_id  BIGINT NOT NULL UNIQUE,
        FOREIGN KEY (client_id) REFERENCES profiles(id) ON DELETE CASCADE
    );