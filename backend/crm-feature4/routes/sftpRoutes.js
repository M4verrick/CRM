const express = require('express');
const sftpController = require('../controllers/sftpController');
const router = express.Router();


router.get('/download-file', sftpController.downloadAndProcessFiles);

module.exports = router;



