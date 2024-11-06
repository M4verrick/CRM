const { Pool } = require('pg');

const pool = new Pool({
    host: 'my-primary-db.crcwuko4kdlb.ap-southeast-1.rds.amazonaws.com',
    user: 'crmdbadmin',
    password: '',
    database: 'crmdb',
    port: 5432,
});

async function getDataFromRDS() {
    const client = await pool.connect();
    try {
        console.log("Connected to RDS database");

        // Define and execute the query
        const query = "SELECT * FROM transactions";  // Your table name
        const result = await client.query(query);

        // Process and print each row from the result
        result.rows.forEach(row => {
            console.log(row);
        });

    } catch (error) {
        console.error("Error fetching data from RDS:", error);
    } finally {
        client.release(); // Release the client back to the pool
        console.log("Connection closed");
    }
}

// Call the function to fetch data
getDataFromRDS();


module.exports = { getDataFromRDS };
