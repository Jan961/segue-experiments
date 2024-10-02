import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import getPrismaClient from 'lib/prisma';
import { CompanyContractStatus } from 'config/contracts';
import { contractSchema } from 'validators/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const prisma = await getPrismaClient(req);
    const validatedData = await contractSchema.validate(req.body, { abortEarly: false });

    const {
      production,
      department,
      role,
      personId,
      //   templateId,
      contractDetails,
      accScheduleJson = [],
    } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the contract
      const contract = await tx.aCCContract.create({
        data: {
          RoleName: role,
          FirstDay: new Date(contractDetails.firstDayOfWork),
          LastDay: new Date(contractDetails.lastDayOfWork),
          Availability: contractDetails.specificAvailabilityNotes,
          RehearsalLocation: contractDetails.rehearsalVenue?.townCity || null,
          RehearsalVenueNotes: contractDetails.rehearsalVenue?.notes || null,
          IsAccomProvided: contractDetails.isAccomodationProvided || false,
          AccomNotes: contractDetails.accomodationNotes || null,
          IsTransportProvided: contractDetails.isTransportProvided || false,
          TransportNotes: contractDetails.transportNotes || null,
          IsNominatedDriver: contractDetails.isNominatedDriver || false,
          NominatedDriverNotes: contractDetails.nominatedDriverNotes || null,
          PaymentType: contractDetails.paymentType || null,
          WeeklyRehFee: contractDetails.weeklyPayDetails?.rehearsalFee || null,
          WeeklyRehHolPay: contractDetails.weeklyPayDetails?.rehearsalHolidayPay || null,
          WeeklyPerfFee: contractDetails.weeklyPayDetails?.performanceFee || null,
          WeeklyPerfHolPay: contractDetails.weeklyPayDetails?.performanceHolidayPay || null,
          WeeklySubs: contractDetails.weeklyPayDetails?.touringAllowance || null,
          WeeklySubsNotes: contractDetails.weeklyPayDetails?.subsNotes || null,
          TotalFee: contractDetails.totalPayDetails?.totalFee || null,
          TotalHolPay: contractDetails.totalPayDetails?.totalHolidayPay || null,
          TotalFeeNotes: contractDetails.totalPayDetails?.feeNotes || null,
          CancelFee: contractDetails.cancellationFee || null,
          ContractStatus: CompanyContractStatus.NotYetIssued,
          CurrencyCode: contractDetails.currency || null,
          ACCScheduleJSON: JSON.stringify(accScheduleJson),
          DateIssued: new Date(),
          ...(department && {
            ACCDepartment: {
              connect: {
                ACCDeptId: department,
              },
            },
          }),
          ...(personId && {
            Person: {
              connect: {
                PersonId: personId,
              },
            },
          }),
          ...(production && {
            Production: {
              connect: {
                Id: production,
              },
            },
          }),
          ...(contractDetails.rehearsalVenue.venue && {
            Venue: {
              connect: {
                Id: contractDetails.rehearsalVenue.venue,
              },
            },
          }),
        },
      });

      if (contractDetails.additionalClause && contractDetails.additionalClause.length > 0) {
        await tx.aCCClause.createMany({
          data: contractDetails.additionalClause.map((clauseId: number) => ({
            ACCContractId: contract.ContractId,
            StdClauseId: clauseId,
          })),
        });
      }

      if (contractDetails.paymentBreakdownList && contractDetails.paymentBreakdownList.length > 0) {
        await tx.aCCPayment.createMany({
          data: contractDetails.paymentBreakdownList.map((payment: any) => ({
            ACCContractId: contract.ContractId,
            Date: new Date(payment.date),
            Amount: payment.amount,
            Notes: payment.notes || null,
          })),
        });
      }

      if (contractDetails.publicityEventList && contractDetails.publicityEventList.length > 0) {
        await tx.aCCPubEvent.createMany({
          data: contractDetails.publicityEventList.map((event: any) => ({
            ACCContractId: contract.ContractId,
            Date: new Date(event.date),
            Notes: event.notes || null,
          })),
        });
      }

      if (contractDetails.customClauseList && contractDetails.customClauseList.length > 0) {
        await tx.aCCClause.createMany({
          data: contractDetails.customClauseList.map((clauseText: string) => ({
            ACCContractId: contract.ContractId,
            Text: clauseText,
          })),
        });
      }

      return contract;
    });

    res.status(201).json({ message: 'Contract created successfully', contractId: result.ContractId });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
