import prisma from 'lib/prisma'
import { emailService } from 'services/emailService'

export default  async function handle(req, res) {

    try {

        const userToDelete = req.body.userToDelete
        const userToAllocate = ""

        //Remove all permissions this must be done first
        const deleteUsersPermission = await prisma.userPermissions.deleteMany({
            where: {
                UserID: {
                    equals: userToDelete,
                },
            },
        })

        const deleteUser = await prisma.user.delete({
            where: {
                UserId : userToDelete,
            },
        })

        // remove User
        /**
        const updatreTasks = await prisma.tasks.updateMany({
            where: {
                UserId: {
                    equals: userToDelete,
                },
            },
            data: {
                UserId: UserToAllocate,
            },
        })

    */
        // Email user to tell them they have new tasks
        emailService.deleteUser(req)

        res.status(200)

    } catch (err) {
        console.log(err);
        res.status(403).json({err: "Error occurred while generating search results."});
    }

}


