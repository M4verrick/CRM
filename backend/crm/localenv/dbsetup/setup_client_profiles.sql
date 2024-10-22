-- Create the profiles table
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
                          id SERIAL PRIMARY KEY,
                          first_name VARCHAR(50) NOT NULL,
                          last_name VARCHAR(50) NOT NULL,
                          email VARCHAR(100) NOT NULL UNIQUE,
                          phone VARCHAR(15),
                          address VARCHAR(100),
                          city VARCHAR(50),
                          state VARCHAR(50),
                          zip VARCHAR(10),
                          country VARCHAR(50),
                          date_of_birth DATE,
                          gender VARCHAR(10),
                          is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
                          verification_token VARCHAR(64),
                          verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
);

-- Insert some initial data
INSERT INTO profiles (first_name, last_name, email, phone, address, city, state, zip, country, date_of_birth, gender, is_email_verified, verification_token, verification_status)
VALUES
    ('John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St', 'Anytown', 'Anystate', '12345', 'USA', '1990-01-01', 'Male', FALSE, 'token123', 'PENDING'),
    ('Jane', 'Smith', 'jane.smith@example.com', '0987654321', '456 Elm St', 'Othertown', 'Otherstate', '67890', 'USA', '1985-05-15', 'Female', FALSE, 'token456', 'PENDING');