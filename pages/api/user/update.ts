import { UserDto } from 'interfaces';
import { userMapper } from 'lib/mappers';
import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body as UserDto;

    const updatedUser = await master.user.update({
      data: {
        UserFirstName: user.FirstName,
        UserLastName: user.LastName,
      },
      where: {
        UserId: user.Id,
      },
    });

    return res.json(userMapper(updatedUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating the user.' });
  }
}
