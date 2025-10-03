const express  = require('express');
const router = express.Router();
const {getCageIdByClaimCode} = require('../services/cageService');
const mqttClient = require('../services/mqttClient');
const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/addEsp32', async (req, res) => {
    try {
        const {claimCode, userId} = req.body;

        if(!claimCode) {
            return res.status(400).json({error: 'Claim code is required'});
        }
        const cage = await getCageIdByClaimCode(claimCode);

        if(!cage) {
            return res.status(404).json({error: 'Invalid claim code'});
        }

        await prisma.userCages.create({
            data: {
                userId: BigInt(userId),
                cageId: cage.cageId
            }
        })

        return res.json({
            message: 'Cage claimed successfully',
            cageId: cage.cageId,
            userId: userId
        })

    }
    catch (error) {
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

        const userCages = await prisma.userCages.findMany({
            where: {userId: BigInt(userId)},
            include: {cages: true}
        });

        if(userCages.length === 0) {
            return res.status(404).json({error: 'No cages found for this user'});
        }

        return res.json({
            cages: userCages.map(uc => ({
                cageId: uc.cages.cageId
            }))
        });
    } 
    catch (error) {
        console.error("Error getting cage:", error);
        res.status(500).json({error: 'Internal server error'});
    }
})


module.exports = router;

