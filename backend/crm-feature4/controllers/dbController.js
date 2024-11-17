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
const getTransactionsByAgent = async (req, res) => {
    const clientId =req.params.agentId;
    
    try {
        const data = await dbService.getTransactionsByAgentId(clientId);
        
	if (data.length === 0) {
            res.status(404).json({ message: 'No transactions found for this client ID' });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve transactions for the specified client ID' });
    }
};


// Export the controller functions
module.exports = {
    getTransactions,getTransactionsByAgent

};
