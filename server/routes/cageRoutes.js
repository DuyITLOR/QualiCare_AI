const express  = require('express');
const router = express.Router();
const {getCageIdByClaimCode} = require('../services/cageService');
const mqttClient = require('../services/mqttClient');

router.post('/claim', async (req, res) => {
    try {
        const {claimCode} = req.body;

        if(!claimCode) {
            return res.status(400).json({error: 'Claim code is required'});
        }
        const cage = await getCageIdByClaimCode(claimCode);

        if(!cage) {
            return res.status(404).json({error: 'Invalid claim code'});
        }

        const topic = `cages/${cage.cageId}/up`;
        mqttClient.subscribe(topic, (err) => {
            if (err){
                console.error("Failed to subscribe to topic:", err);
                return res.status(500).json({error: 'Failed to subscribe to cage updates'});
            }

            console.log(`Subscribed to topic: ${topic}`);
        })
        return res.json({message: 'Cage claimed successfully', cageId: cage.cageId});

    }
    catch (error) {
        console.error("Error claiming cage:", error);
        res.status(500).json({error: 'Internal server error'});
    }
})

module.exports = router;