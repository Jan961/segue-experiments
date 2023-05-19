import prisma from 'lib/prisma'

/**
 *
 * Validate Session - Check that the user USERID + Session IS is active if not log user out
 *
 * @param req
 * @param res
 */
export default async function handle(req, res) {



    try {
        await prisma.userSessions.findFirst(
            {
                where:{
                    UserID: res.data.UserId,
                    SessionID: res.data.SessionId,
                    AccountID: res.data.AccountID,

                },
            }
        )
        res.status(200).end();
    }

    catch (error) {
        res.json(error);
        res.status(405).end();
    }

}
