const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Route to process and store CSV data
router.post('/process-csv', dataController.processCSVAndStore);

module.exports = router;
