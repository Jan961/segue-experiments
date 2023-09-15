import { UserDto } from 'interfaces'
import { userMapper } from 'lib/mappers'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAccountId, getEmailFromReq } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body as UserDto

    const email = await getEmailFromReq(req)
    const AccountId = await getAccountId(email)

    const newUser = await prisma.user.create({
      data: {
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        AccountId
      }
    })

    return res.json(userMapper(newUser))
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while creating the user.' })
  }
}
