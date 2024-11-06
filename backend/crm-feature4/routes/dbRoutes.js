const express = require('express');
const { getDataFromRDS } = require('../services/dbService');
const router = express.Router();

router.get('/get-data', async (req, res) => {
    try {
        const data = await getDataFromRDS();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

module.exports = router;
