import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import ReactPDF from '@react-pdf/renderer';
import { transformContractResponse } from 'transformers/contracts';
import JendagiContractRenderer from 'services/reportPDF/JendagiContractRenderer';
import { getContractDataById } from 'services/contracts';
import { getPersonById } from 'services/person';
import { transformPersonWithRoles } from 'transformers/person';
import { pick } from 'radash';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Contract ID is required' });
  }

  try {
    const contractId = Number(id);
    const contractData = await getContractDataById(contractId);
    const contractDetails = transformContractResponse(contractData);
    const contractSchedule = pick(contractDetails, ['production', 'department', 'personId', 'role']);
    const productionDetails = await prisma.Production.findUnique({
      where: {
        Id: contractSchedule.production,
      },
      include: {
        ProductionCompany: true,
        Show: true,
      },
    });
    const showName = `${productionDetails?.Show?.Code}${productionDetails?.Code} ${productionDetails.Show?.Name}`;
    const person = await getPersonById(Number(contractSchedule.personId));
    const personDetails = await transformPersonWithRoles(person);
    const productionCompany = productionDetails?.ProductionCompany;
    const reportStream = await ReactPDF.renderToStream(
      <JendagiContractRenderer
        productionCompany={productionCompany}
        contractDetails={contractDetails?.contractDetails}
        contractSchedule={contractSchedule}
        contractPerson={personDetails}
        showName={showName}
      />,
    );
    res.setHeader('Content-Type', 'application/pdf');
    reportStream.pipe(res);
    reportStream.on('end', () => console.log('Done streaming, response sent.'));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
