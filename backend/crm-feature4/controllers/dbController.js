// controllers/dbController.js
const dbService = require('../services/dbService');

const getTransactions = async (req, res) => {
    try {
        const data = await dbService.getDataFromRDS();
        res.status(200).json(data.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
};



// Export the controller functions
module.exports = {
    getTransactions,
};
