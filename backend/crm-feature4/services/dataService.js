const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const dbService = require('./dbService'); // Import the dbService for database operations

// Function to process and store CSV data into RDS
async function processAndStoreCSV(filePath) {
    const results = [];
    console.log('IM USING THIS')
    // Step 1: Read and parse CSV file
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Map CSV data to match the RDS table fields
                results.push({
                    id: parseInt(row.ID, 10),
                    client_id: parseInt(row['Client ID'], 10),
                    transaction_type: row.Transaction === 'D' ? 'Deposit' : 'Withdrawal',
                    amount: parseFloat(row.Amount),
                    transaction_date: new Date(row.Date),
                    status: row.Status
                });
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');

                // Step 2: Insert data into RDS
                try {
                    for (const record of results) {
                        await dbService.insertTransaction(record);
                    }
                    resolve();
                } catch (error) {
                    console.error('Error storing data in RDS:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
}

module.exports = {
    processAndStoreCSV
};
