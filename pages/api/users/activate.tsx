import { generateGUID } from 'utils/guid'
import prisma from 'lib/prisma'
const bcrypt = require('bcryptjs')

export default async function handle(req, res) {


    const email = req.body.emailAddress
    const password = bcrypt.hashSync(req.body.password, 10);
    const guid = req.body.guid

    try {
        const activateUser = await prisma.user.update({
            where: {
                EmailAddress: email,
               // guid: guid
            },
            data: {
                IsActive: true,
                Guid: generateGUID(), //changed the guid to prevent password change
                Password: password
            },
        })
        return res.status(200).json();
    } catch (e) {

        return res.status(501)
    }

}
