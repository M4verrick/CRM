const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const dbService = require('../services/dbService');

// SFTP Configuration
const sftp = new Client();
const targetHost = "10.0.10.119";
const targetPort = 22;
const username = "ec2-user";
const privateKeyPath = "/home/ec2-user/.ssh/feature4";
const remoteDirectoryPath = "/home/ec2-user/files";
const localDirectoryPath = path.join(__dirname, 'files');

// SQLite Configuration

const dbPath = path.join(__dirname, 'downloaded_files.db');
const db = new sqlite3.Database(dbPath);
// Ensure the downloaded_files table exists
db.run(`
    CREATE TABLE IF NOT EXISTS downloaded_files (
        filename TEXT PRIMARY KEY,
        download_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Function to check if a file has been downloaded
function isFileDownloaded(filename) {
    return new Promise((resolve, reject) => {
        db.get("SELECT 1 FROM downloaded_files WHERE filename = ?", [filename], (err, row) => {
            if (err) reject(err);
            resolve(!!row);
        });
    });
}

// Function to log a downloaded file
function logDownloadedFile(filename) {
    return new Promise((resolve, reject) => {
        db.run("INSERT OR IGNORE INTO downloaded_files (filename) VALUES (?)", [filename], (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

// Function to process CSV file and store data into RDS
async function processCSVFile(localFilePath) {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(localFilePath)
            .pipe(csv())
            .on('data', (row) => {
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
                const insertedRecords = [];
                try {
                    for (const record of results) {
                        await dbService.insertTransaction(record);
                        insertedRecords.push(record);
                    }
                    resolve(insertedRecords);
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
async function downloadFile() {
    const processedFiles = [];
    const insertedRecords = [];
    const fileProcessingPromises = []; // Array to hold file processing promises
    const db = new sqlite3.Database(dbPath);
    try {
        await sftp.connect({
            host: targetHost,
            port: targetPort,
            username: username,
            privateKey: fs.readFileSync(privateKeyPath)
        });

        const remoteFiles = await sftp.list(remoteDirectoryPath);

        if (!fs.existsSync(localDirectoryPath)) {
            fs.mkdirSync(localDirectoryPath, { recursive: true });
        }

        for (const file of remoteFiles) {
            const filename = file.name;
            const remoteFilePath = `${remoteDirectoryPath}/${filename}`;
            const localFilePath = path.join(localDirectoryPath, filename);

            if (!(await isFileDownloaded(filename))) {
                console.log(`Downloading new file: ${filename}...`);
                await sftp.get(remoteFilePath, localFilePath);
                console.log(`File ${filename} downloaded successfully!`);

                await logDownloadedFile(filename);

                // Process CSV and store the resulting promise in the array
                const processPromise = processCSVFile(localFilePath).then((records) => {
                    insertedRecords.push(...records);
                    processedFiles.push(filename);
                });

                fileProcessingPromises.push(processPromise); // Add promise to array
            }
        }

        // Wait for all file processing to complete
        await Promise.all(fileProcessingPromises);
    } catch (err) {
        console.error("An error occurred:", err);
        throw err;
    } finally {
        // Close the SFTP connection
        sftp.end();

        // Close the database connection after all promises have resolved
        db.close((err) => {
            if (err) {
                console.error("Error closing SQLite database:", err);
            } else {
                console.log("SQLite database connection closed.");
            }
        });
        console.log("SFTP connection closed.");
    }

    return { processedFiles, insertedRecords };
}


module.exports = {
    downloadFile,
};
