const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/transactions', dbController.getTransactions);
router.get('/transactions/client/:clientId', dbController.getTransactionsByClientId);


module.exports = router;





