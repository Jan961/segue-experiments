import getConfig from 'next/config'
import { apiHandler } from 'helpers/api/api-handler'
import prisma from 'lib/prisma'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { serverRuntimeConfig } = getConfig()

export default apiHandler({
    post: authenticate
});

async function authenticate(req, res) {

    const email: string = req.body.email
    const password: string = req.body.password

    const user = await prisma.user.findFirst({
        where: {
            EmailAddress: email,
        },
    })

        // validate

            if (!(user && bcrypt.compareSync(password, user.Password))) {
                throw 'Username or password is incorrect';
            } else {
                if(!user.IsActive){
                    throw 'Your Account is not active, Please contact the administrator'
                } else {
                    // Account Can log in
                        // Create a licenced session

                        // if (account.licences >= session.count) {
                            // notiy account admin, Session limit reached
                            // throw 'Your account has no more sessions available, contact your administator to increase the number of actve users'
                        //}
                    // Check seats available
                    // TODO: licence check
                }
            }





    // create a jwt token that is valid for 7 days
    const token = jwt.sign({sub: user.UserId}, serverRuntimeConfig.secret, {expiresIn: '7d'});

    //Update stored token for in session



    // return basic user details and token
    return res.status(200).json({
        id: user.UserId,
        email: user.EmailAddress,
        name: user.UserName,
        accountId: user.AccountId,
        accountOwner: user.AccountOwner,
        accountAdmin: user.AccountAdmin,
        segueAdmin: user.SegueAdmin,
        token
    });
}
