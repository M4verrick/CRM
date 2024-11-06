const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const sftp = new Client();
const targetHost = "10.0.10.119"; // Private IP of the target instance
const targetPort = 22;           // Default SSH port
const username = "ec2-user";     // Username, typically 'ec2-user' for Amazon Linux
const privateKeyPath = "/home/ec2-user/.ssh/feature4"; // Path to your private key
const remoteFilePath = "/home/ec2-user/files/transactions1.csv"; // File path on the target instance
const localFilePath = path.join(__dirname, 'files'); // Local save path

async function downloadFile() {
    try {
        // Connect using the private key for authentication
        await sftp.connect({
            host: targetHost,
            port: targetPort,
            username: username,
            privateKey: fs.readFileSync(privateKeyPath), // Load private key file
            // passphrase: 'your-passphrase' // Optional, only if the key has a passphrase
        });

        console.log(`Downloading file from ${remoteFilePath} to ${localFilePath}...`);

        // Download the file
        await sftp.get(remoteFilePath, localFilePath);
        console.log("File downloaded successfully!");

    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        sftp.end(); // End the SFTP session
    }
}

// Run the download function
downloadFile();
