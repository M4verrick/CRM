// controllers/sftpController.js
const sftpService = require('../services/sftpService');

const downloadAndProcessFiles = async (req, res) => {
    try {
        const files = await sftpService.downloadFile();
        res.status(200).json({
            message: 'Files downloaded and processed successfully',
            files
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to download and process files' });
    }
};

module.exports = {
    downloadAndProcessFiles,
};
