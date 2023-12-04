import prisma from 'lib/prisma';


export const getMasterTasksList = async (AccountId: number) => {
    return await prisma.masterTask.findMany({
        where:{
            AccountId
        }
    })
}