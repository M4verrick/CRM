const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const dbService = require('../services/dbService');
// SFTP Configuration
const sftp = new Client();
const targetHost = "10.0.10.119"; // Private IP of the target instance
const targetPort = 22;            // Default SSH port
const username = "ec2-user";      // Username, typically 'ec2-user' for Amazon Linux
const privateKeyPath = "/home/ec2-user/.ssh/feature4"; // Path to your private key
const remoteDirectoryPath = "/home/ec2-user/files";    // Remote directory path
const localDirectoryPath = path.join(__dirname, 'files'); // Local save directory

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






async function downloadFile() {
    const processedFiles = [];
    const insertedRecords = [];

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
                await sftp.get(remoteFilePath, localFilePath);
                await logDownloadedFile(filename);
                
                // Process CSV file and gather inserted records
                const records = await processCSVFile(localFilePath);
                insertedRecords.push(...records);

                processedFiles.push(filename);
            }
        }
    } catch (err) {
        console.error("An error occurred:", err);
        throw err;
    } finally {
        sftp.end();
        db.close();
    }

    return { processedFiles, insertedRecords };
}

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
                        insertedRecords.push(record); // Track each inserted record
                    }
                    resolve(insertedRecords); // Resolve with all inserted records
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
    downloadFile,
};