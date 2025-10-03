const express  = require('express');
const router = express.Router();
const {getCageIdByClaimCode,addEsp32,getEsp32,updateEsp32,deleteEsp32} = require('../services/cageService');
const mqttClient = require('../services/mqttClient');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/addEsp32', async (req, res) => {
    try {
        const {claimCode, userId, cageName} = req.body;

        if(!claimCode) {
            return res.status(400).json({error: 'Claim code is required'});
        }
        const cage = await getCageIdByClaimCode(claimCode);

        if(!cage) {
            return res.status(404).json({error: 'Invalid claim code'});
        }

        const created = await addEsp32(userId, cage.cageId, cageName);

        return res.json({
            message: 'Cage claimed successfully',
            cageId: created.cageId,
            userId: String(userId),
            cageName: created.cageName
        })

    }
    catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'User exits' });
        }
        console.error("Error claiming cage:", error);
        res.status(500).json({error: 'Internal server error'});
    }
})


router.get('/getEsp32',  async (req, res) => {
    try {
        const {userId}  = req.body;
        console.log("User ID:", userId);
        if(!userId) {
            return res.status(400).json({error: 'User ID is required'});
        }

        const userCages = await getEsp32(userId)

        if(userCages.length === 0) {
            return res.status(404).json({error: 'No cages found for this user'});
        }

        return res.json({
            cages: userCages.map(uc => ({
                cageId: uc.cages.cageId,
                cageName: uc.cageName
            }))
        });
    } 
    catch (error) {
        console.error("Error getting cage:", error);
        res.status(500).json({error: 'Internal server error'});
    }
})


router.put('/updateEsp32', async (req, res) => {
    try {
        const {userId, cageId, cageName} = req.body

        if(!userId ||  !cageId)
        {
            return res.status(400).json({error: 'User ID and Cage ID are required'});
        }

        const updatedCage = await updateEsp32(userId, cageId, cageName);

        return res.json({
            message: 'Cage updated successfully',
            updated: updatedCage
        });
    }
    catch (error) {
        console.error("Error updating cage:", error);
        res.status(500).json({error: 'Internal server error'});
    }
})


router.delete('/deleteEsp32', async (req, res) => {
    try {
        const {userId, cageId} = req.body;

        if(!userId || !cageId) {
            return res.status(400).json({error: 'User ID and Cage ID are required'});
        }

        const deletedCage = await deleteEsp32(userId, cageId);

        return res.json({
            message: 'Cage deleted successfully',
            deleted: deletedCage
        });

    } catch (error) {
        console.error("Error deleting cage:", error);
        res.status(500).json({error: 'Internal server error'});   
    }
})


module.exports = router;

