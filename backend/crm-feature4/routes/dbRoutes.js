const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/transactions', dbController.getTransactions);
router.get('/agent/:agentId', dbController.getTransactionsByAgent);


module.exports = router;





