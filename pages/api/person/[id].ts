import prisma from 'lib/prisma';
import { transformPersonDetails, transformOrganisationDetails, transformAccountDetails } from 'transformers/contracts';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    const person = await prisma.person.findUnique({
      where: { PersonId: Number(id) },
      include: {
        Address: true,
        Organisation_Person_PersonAgencyOrgIdToOrganisation: {
          include: {
            Person_Organisation_OrgContactPersonIdToPerson: {
              include: {
                Address: true,
              },
            },
          },
        },
        PersonPersonRole: {
          include: {
            PersonRole: true,
          },
        },
        PersonOtherRole: true,
        PersonPerson_PersonPerson_PPPersonIdToPerson: {
          include: {
            Person_PersonPerson_PPRolePersonIdToPerson: {
              include: {
                Address: true,
              },
            },
          },
        },
      },
    });

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const emergencyContacts = person?.PersonPerson_PersonPerson_PPPersonIdToPerson?.reduce?.(
      (contacts, personPerson) => {
        if (personPerson.PPRoleType === 'emergencycontact') {
          contacts.push(personPerson.Person_PersonPerson_PPRolePersonIdToPerson);
        }
        return contacts;
      },
      [],
    );

    const expensesAccountDetails = {
      paidTo: person.PersonExpensesTo || null,
      accountName: person.PersonExpensesAccountName || '',
      accountNumber: person.PersonExpensesAccount || '',
      sortCode: person.PersonExpensesSortCode || '',
      swift: person.PersonExpensesSWIFTBIC || '',
      iban: person.PersonExpensesIBAN || '',
      country: person.PersonExpensesBankCountryId || null,
    };

    const responsePayload = {
      personDetails: transformPersonDetails(person),
      agencyDetails: transformOrganisationDetails(person.Organisation_Person_PersonAgencyOrgIdToOrganisation),
      salaryAccountDetails: transformAccountDetails(person),
      expenseAccountDetails: expensesAccountDetails,
      emergencyContact1: transformPersonDetails(emergencyContacts?.[0]),
      emergencyContact2: transformPersonDetails(emergencyContacts?.[1]),
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
