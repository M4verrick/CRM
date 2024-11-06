const express = require('express');
const { downloadFile } = require('../services/sftpService2');
const router = express.Router();

router.get('/download-file', async (req, res) => {
    try {
        await downloadFile();
        res.status(200).json({ message: 'File downloaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to download file' });
    }
});

module.exports = router;
