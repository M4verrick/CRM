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

    } catch (error) {
        console.error("Error fetching data from RDS:", error);
    } finally {
        //e the client connection
        console.log("Connection closed");
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


module.exports = { getDataFromRDS,insertTransaction };
