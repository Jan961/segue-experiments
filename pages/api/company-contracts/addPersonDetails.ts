import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.bookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    const newPerson = await prisma.person.create({
      data: {
        PersonFirstName: 'John',
        PersonLastName: 'Doe',
        PersonEmail: 'john.doe@example.com',
      },
    });

    // Step 2: Create a new ACCContractPerson entry
    const newAccContractPerson = await prisma.accContractPerson.create({
      data: {
        ACCCPersonPersonId: newPerson.PersonId,
        ACCCPersonType: 'Type', // Add other fields as necessary
      },
    });

    // Step 3: Create a new ACCContract entry using the ACCCPersonId
    const newAccContract = await prisma.accContract.create({
      data: {
        PersonId: newAccContractPerson.ACCCPersonId, // Link to the ACCCPersonId
        RoleName: 'Role Name',
        ContractStatus: 'Status',
      },
    });

    // const createResult = await prisma.contract.create({
    //   data: {
    //     BookingId,
    //     BarringClauseBreaches: req.body.BarringClauseBreaches,
    //   },
    // });

    return res.json(newAccContract);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while creating the contract.' });
  }
}
