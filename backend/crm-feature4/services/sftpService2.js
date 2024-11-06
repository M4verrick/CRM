const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// SFTP Configuration
const sftp = new Client();
const targetHost = "10.0.10.119"; // Private IP of the target instance
const targetPort = 22;            // Default SSH port
const username = "ec2-user";      // Username, typically 'ec2-user' for Amazon Linux
const privateKeyPath = "/home/ec2-user/.ssh/feature4"; // Path to your private key
const remoteDirectoryPath = "/home/ec2-user/files";    // Remote directory path
const localDirectoryPath = path.join(__dirname, 'files'); // Local save directory

// SQLite Configuration
const dbPath = path.join(localDirectoryPath, 'downloaded_files.db');
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

// Main function to download new files from the remote directory
async function downloadFile() {
    try {
        // Connect using the private key for authentication
        await sftp.connect({
            host: targetHost,
            port: targetPort,
            username: username,
            privateKey: fs.readFileSync(privateKeyPath)
        });

        console.log(`Listing files in remote directory ${remoteDirectoryPath}...`);
        const remoteFiles = await sftp.list(remoteDirectoryPath);

        // Ensure local directory exists
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

                // Log the downloaded file in SQLite
                await logDownloadedFile(filename);
            } else {
                console.log(`Skipping already downloaded file: ${filename}`);
            }
        }
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        sftp.end(); // End the SFTP session
        db.close(); // Close the database connection
    }
}

// Run the function to download new files
downloadFile();
