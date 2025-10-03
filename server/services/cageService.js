const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getCageIdByClaimCode(claimCode)
{
    const cage = await prisma.cages.findUnique({
        where : {claimCode}
    })

    return cage;
}

module.exports = {
    getCageIdByClaimCode,
}