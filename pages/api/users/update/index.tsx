import prisma from 'lib/prisma'
const bcrypt = require('bcryptjs')

export default  async function handle(req, res) {

    let FormData = {
        UserName : req.body.UserName,
        emailAddress : req.body.emailAddress,
        UserId: req.body.UserId,
    }

    /**
     * Onlt Change the password if the password can be validated here and has not been
     * intercepted in transmission and changed.
     */
    if(req.body.password !== undefined
        && req.body.password !== null
        && req.body.passwordConfirm !== undefined
        && req.body.passwordConfirm !== null
        && req.body.password === req.body.passwordConfirm
        ){
        // We want to change the password

        FormData["password"] = bcrypt.hashSync(req.body.password, 10)
    }

   try {

        // @ts-ignore
       const updateAccount = await prisma.user.update({
            where: {
                UserId: parseInt(req.body.UserId)
            },
            data: FormData
        })

       // console.log(updateAccount)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(updateAccount))
        //res.json(result)

    } catch (err) {
        console.log(err);
        res.status(403).json({err: "Error occurred while generating search results."});
    }

}


