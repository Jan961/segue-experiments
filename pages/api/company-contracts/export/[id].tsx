/*
    *****   PLEASE NOTE WHEN REVIEWING    *****
    This needs updated to use David's Word to PDF API combined with the Easy template X logic.
    When this logic is integrated, this will work.
    To be completed by Patrick Lafferty after Deal Memo is complete in full.
*/

// import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
// import master from 'lib/prisma_master';
// import { transformContractResponse } from 'transformers/contracts';
// import { getContractDataById } from 'services/contracts';
// import { getPersonById } from 'services/person';
// import { transformPersonWithRoles } from 'transformers/person';
// import { pick } from 'radash';
// import { IScheduleDay } from 'components/contracts/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json({ error: 'New contract export functionality for saving requires work' });

  // const { id } = req.query;

  // if (!id) {
  //   return res.status(400).json({ message: 'Contract ID is required' });
  // }

  // try {
  //   const prisma = await getPrismaClient(req);
  //   const contractId = Number(id);
  //   const contractData = await getContractDataById(contractId, req);
  //   const contractDetails = transformContractResponse(contractData);
  //   const contractSchedule = pick(contractDetails, ['production', 'department', 'personId', 'role']);
  //   const productionDetails = await prisma.production.findUnique({
  //     where: {
  //       Id: contractSchedule.production,
  //     },
  //     include: {
  //       Show: true,
  //     },
  //   });
  //   const productionCompany = await master.productionCompany.findUnique({
  //     where: {
  //       ProdCoId: productionDetails.ProdCoId,
  //     },
  //   });
  //   const showName = `${productionDetails?.Show?.Code}${productionDetails?.Code} ${productionDetails.Show?.Name}`;
  //   const person = await getPersonById(Number(contractSchedule.personId), req);
  //   const personDetails = await transformPersonWithRoles(person);
  //   const schedule = contractDetails?.contractDetails?.accScheduleJson as IScheduleDay[];
  //   // const reportStream = await ReactPDF.renderToStream(
  //   //   // <JendagiContractRenderer
  //   //   //   productionCompany={productionCompany}
  //   //   //   contractDetails={contractDetails?.contractDetails}
  //   //   //   contractSchedule={contractSchedule}
  //   //   //   contractPerson={personDetails}
  //   //   //   showName={showName}
  //   //   //   schedule={schedule || []}
  //   //   // />,
  //   // );
  //   res.setHeader('Content-Type', 'application/pdf');
  //   // reportStream.pipe(res);
  //   // reportStream.on('end', () => console.log('Done streaming, response sent.'));
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: 'Internal server error', error: error.message });
  // }
}
