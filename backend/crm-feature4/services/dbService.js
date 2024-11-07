const { Client } = require('pg');

// Database configuration - replace with your actual RDS details
const client = new Client({
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
        await client.connect();
        console.log("Connected to RDS database");

        // Define and execute the query
        const query = "SELECT * FROM transactions"; // Replace with your table name
        const result = await client.query(query);

        // Process and print each row from the result
        result.rows.forEach(row => {
            console.log(row);
        });

    } catch (error) {
        console.error("Error fetching data from RDS:", error);
    } finally {
        await client.end(); // Close the client connection
        console.log("Connection closed");
    }
}

// Call the function to fetch data
getDataFromRDS();

module.exports = { getDataFromRDS };
