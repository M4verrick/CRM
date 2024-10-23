-- Create the client_accounts table
DROP TABLE IF EXISTS client_accounts;
CREATE TABLE client_accounts
(
    account_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id      BIGINT      NOT NULL,
    account_type   VARCHAR(50) NOT NULL,
    account_status VARCHAR(50) NOT NULL,
    opening_date   DATE,
    currency       VARCHAR(3)  NOT NULL,
    branch_id      VARCHAR(10) NOT NULL,
    initial_deposit DOUBLE NOT NULL
);

-- Insert some initial data
INSERT INTO client_accounts (client_id, account_type, account_status, opening_date, currency, branch_id,
                             initial_deposit)
VALUES (1, 'SAVINGS', 'ACTIVE', '2023-01-01', 'USD', 'BR001', 1000.00),
       (2, 'CHECKING', 'PENDING', '2023-02-01', 'USD', 'BR002', 500.00),
       (3, 'BUSINESS', 'INACTIVE', '2023-03-01', 'EUR', 'BR003', 2000.00);