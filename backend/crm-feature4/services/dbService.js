const { Client:PgClient,Pool } = require('pg');

// Database configuration - replace with your actual RDS details
const pool = new Pool({
    host: 'my-primary-db.crcwuko4kdlb.ap-southeast-1.rds.amazonaws.com',
    user: 'crmdbadmin',
    password: '', // Add your actual password here or use environment variables for security
    database: 'crmdb',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

// Function to fetch data from RDS
async function getDataFromRDS() {
    try {
        // Connect to the RDS database
        const client = await pool.connect();
        console.log("Connected to RDS database");

        // Define and execute the query
        const query = "SELECT * FROM transactions"; // Replace with your table name
        const result = await pool.query(query);

        // Process and print each row from the result
        result.rows.forEach(row => {
            console.log(row);
        });
        return result;

    } catch (error) {
        console.error("Error fetching data from RDS:", error);
    } finally {
        //e the client connection
        console.log("Connection closed");
    }
}




// Function to fetch transactions by client ID
async function getTransactionsByClientId(clientId) {
    try {
        const client = await pool.connect();
        const query = "SELECT * FROM transactions WHERE client_id = $1";
        const result = await client.query(query, [clientId]);
        client.release();
        return result;
    } catch (error) {
        console.error("Error fetching transactions by client ID:", error);
        throw error;
    }
}

async function getTransactionsByAgentId(agentId) {
    try {
        const client = await pool.connect();

        // SQL query to join transactions and agent_profile and filter by agent_id
        const query = `
            SELECT t.*
            FROM transactions t
            INNER JOIN agent_profile ap ON t.client_id = ap.profile_id
            WHERE ap.agent_id = $1
        `;

        // Execute the query with the provided agent_id
        const result = await client.query(query, [agentId]);
        client.release();
        return result.rows; // Return the rows containing the transactions
    } catch (error) {
        console.error("Error fetching transactions by agent ID:", error);
        throw error;
    }
}


// Function to insert a single transaction record into the RDS database
async function insertTransaction(record) {
    const query = `
        INSERT INTO transactions (id, client_id, transaction_type, amount, transaction_date, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
            client_id = EXCLUDED.client_id,
            transaction_type = EXCLUDED.transaction_type,
            amount = EXCLUDED.amount,
            transaction_date = EXCLUDED.transaction_date,
            status = EXCLUDED.status;
    `;

    const values = [
        record.id,
        record.client_id,
        record.transaction_type,
        record.amount,
        record.transaction_date,
        record.status
    ];

    try {
	
        await pool.query(query, values);
        console.log(`Transaction ${record.id} inserted/updated successfully`);
    } catch (error) {
        console.error('Error inserting transaction:', error);
        throw error;
    } 
}


module.exports = { getDataFromRDS,getTransactionsByAgentId,insertTransaction };
