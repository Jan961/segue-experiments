import { UserDto } from 'interfaces';
import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body as UserDto;

    await master.user.delete({
      where: {
        UserId: user.Id,
      },
    });

    return res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
