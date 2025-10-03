const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();


// get the cage by claim code
async function getCageIdByClaimCode(claimCode)
{
    const cage = await prisma.cages.findUnique({
        where : {claimCode}
    })

    return cage;
}


// add esp32 to user
async function addEsp32(userId, cageId, cageName) {
    return await prisma.userCages.create({
      data: {
        userId: BigInt(userId),
        cageId,
        cageName: cageName ?? null
      }
    });
}


async function getEsp32(userId) {
    return await prisma.userCages.findMany({
      where: { userId: BigInt(userId) },
      include: { cages: true }
    });
}


async function updateEsp32(userId, cageId, cageName) {
    return await prisma.userCages.update({
        where: {
        userId_cageId: {
            userId: BigInt(userId),
            cageId
        }
        },
        data: { cageName }
    });
}

async function deleteEsp32(userId, cageId) {
    return await prisma.userCages.delete({
      where: {
        userId_cageId: {
          userId: BigInt(userId),
          cageId
        }
      }
    });
}


module.exports = {
    getCageIdByClaimCode,
    addEsp32,
    getEsp32,
    updateEsp32,
    deleteEsp32
  };
// module.exports = client